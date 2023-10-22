const router = require("express").Router();
const chatController = require("../controllers/chatControllers");
const { verifyToken } = require("../middleware/verifyToken");

// CREATE CHAT
router.post("/", verifyToken, chatController.accessChat);


// GET CHATS
router.get("/", verifyToken, chatController.getChats);


module.exports = router