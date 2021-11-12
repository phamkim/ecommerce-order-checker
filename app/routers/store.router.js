const { Router } = require("express");
const storeController = require("../controllers/store.controller");
const verifyToken = require("../middleware/auth");
const router = Router()
router.post("/", verifyToken, storeController.addStore);
router.get("/", verifyToken, storeController.listStore);
router.get("/:id", verifyToken, storeController.findStore);
router.put("/:id", verifyToken, storeController.updateStore);
router.delete("/:id", verifyToken, storeController.deleteStore);
module.exports = router;
