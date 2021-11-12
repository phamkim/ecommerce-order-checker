const { Router } = require("express");
const router = Router();
const statisticalController = require("../controllers/statistical.controller");
const verifyToken = require("../middleware/auth");

router.get(
  "/teams",
  verifyToken,
  statisticalController.statisticalTeams
);
module.exports = router;
