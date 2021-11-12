
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { json } = require("body-parser");
const connectDB = require("./app/conf/db");
const schedule = require('node-schedule');
const storeController = require("./app/controllers/store.controller");

const getApiRouter = () => {
  const authRouter = require("./app/routers/auth.router");
  const userRouter = require("./app/routers/user.router");
  const oderRouter = require("./app/routers/order.router");
  const storeRouter = require("./app/routers/store.router");
  const teamRouter = require("./app/routers/team.router");
  const statisticalRouter = require("./app/routers/statistical.router");
  const router = express.Router();
  router.use("/auth", authRouter);
  router.use("/users", userRouter);
  router.use("/orders", oderRouter);
  router.use("/teams", teamRouter);
  router.use("/stores", storeRouter);
  router.use("/statistical", statisticalRouter);
  return router;
};


const main = async () => {
  const cronExpress = '0 59 23 * * *';
  const port = process.env.PORT || 9000;
  const app = express();
  await connectDB();
  app.use(cors({ allowedHeaders: '*' }));
  app.use(json());
  app.use("/api/v1", getApiRouter());
  app.listen(port, () => console.log(`used ${port}`));
  schedule.scheduleJob(cronExpress, storeController.resetStore);
};

main();
