const router = require("express").Router();
const messageController = require("../controllers/messagesController");
const { verifyToken } = require("../middleware/verifyToken");


// CREATE A MESSAGE
router.post("/", verifyToken, messageController.sendMessage);


// GET ALL MESSAGES WITH PAGINATION
router.get("/:id", verifyToken, messageController.allMessages);


// GET ALL MESSAGES WITHOUT PAGINATION
router.get("/all/:id", verifyToken, messageController.allMessagesWithoutPagination);


module.exports = router