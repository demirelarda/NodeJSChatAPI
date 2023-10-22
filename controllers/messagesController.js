const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");


module.exports = {

    allMessages: async (req, res) => {
        try {
            const pageSize = 15; //get 15 messages per page
            const page = req.query.page || 1;
            const skipMessages = (page - 1) * pageSize;

            // using pagination
            var messages = await Message.find({ chat: req.params.id })
                .populate("sender", "username profile email")
                .populate("chat")
                .sort({ createdAt: -1 })
                .skip(skipMessages)
                .limit(pageSize);

            messages = await User.populate(messages, {
                path: "chat.users",
                select: "username profile email",
            });

            res.json(messages);
        } catch (error) {
            res.status(500).json('Server Error: Could not get chats');
        }
    },

    allMessagesWithoutPagination: async (req, res) => {
        try {
            const messages = await Message.find({ chat: req.params.id })
                .populate("sender", "username profile email")
                .populate("chat")
                .sort({ createdAt: -1 }); 
    
            const populatedMessages = await User.populate(messages, {
                path: "chat.users",
                select: "username profile email",
            });
    
            res.json(populatedMessages);
        } catch (error) {
            res.status(500).json('Could not get chats');
        }
    },
    



    sendMessage: async (req, res) => {
        const { content, chatId, receiver, type } = req.body;

        if (!content || !chatId) {
            console.log("Invalid data");
            return res.status(400);
        }

        var newMessage = {
            sender: req.user.id,
            content: content,
            receiver: receiver,
            chat: chatId,
            type: type
        };

        try {
            var message = await Message.create(newMessage);

            message = await message.populate("sender", "username profile email");
            message = await message.populate("chat");
            message = await User.populate(message, {
                path: "chat.users",
                select: "username profile email",
            });

            await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

            res.json(message);
        } catch (error) {
            res.status(400).json(error);
        }
    }
};

