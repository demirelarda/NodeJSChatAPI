const router = require("express").Router();
const fcmController = require("../controllers/fcmController");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/addToken", verifyToken, fcmController.addToken);
router.get("/getTokens", verifyToken, fcmController.getTokens);
router.post("/deleteToken",verifyToken,fcmController.deleteOldToken);

module.exports = router;
