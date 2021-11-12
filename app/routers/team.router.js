const { Router } = require("express");
const teamController = require("../controllers/team.controller");
const verifyToken = require("../middleware/auth");
const router = Router();
router.post("/", verifyToken, teamController.addTeam);
router.get("/", verifyToken, teamController.listTeam);
router.get("/:id", verifyToken, teamController.findTeam);
router.put("/:id", verifyToken, teamController.updateTeam);
router.delete("/:id", verifyToken, teamController.deleteTeam);
module.exports = router;
