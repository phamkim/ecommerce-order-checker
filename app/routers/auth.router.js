
const { Router } = require("express");
const router = Router();
const authController = require("../controllers/auth.controller");
router.get("/logout", authController.logout);
router.post("/login", authController.login);
module.exports = router;
