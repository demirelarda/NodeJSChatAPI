const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const fs = require('fs');

const authRoute = require("./routes/auth");
const chatRoute = require("./routes/chat");
const messageRoute = require("./routes/messages");
const fcmRoute = require('./routes/fcm');
const Token = require('./models/Token');


const serviceAccountData = fs.readFileSync('serviceAccountKey.json'); //get your serviceAccountKey.json from firebase
const serviceAccount = JSON.parse(serviceAccountData);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
}); 


function sendNotification(token, message, imageUrl) {
    let payload = {
        notification: {
            title: 'New Message',
            body: message,
            icon: imageUrl
        }
    };

    admin.messaging().sendToDevice(token, payload)
        .then(response => {
            console.log('Successfully sent message:', response);
        })
        .catch(error => {
            console.log('Error sending message:', error);
        });
}

  

dotenv.config()

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("connected to the db")).catch((err) => { console.log(err) });



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1", authRoute);
app.use("/api/v1/chats", chatRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/fcm",fcmRoute);

// USE: yourServerUrl.com/api/v1/...

async function getUserTokens(userChatID) {
    const userTokens = await Token.findOne({ userChatID: userChatID });
    if (userTokens && userTokens.tokenList) {
        return userTokens.tokenList;
    }
    
    return [];
}


const server = app.listen(process.env.PORT || 3000, () => console.log(`App is listening on port ${process.env.PORT}...`));



//CHAT SOCKETS

const io = require('socket.io')(server,
    {
        pingTimeout: 60000,
        cors: {
            //origin: "http:localhost:5001", //you can use this to test the sockets on local
            origin: "" // Add your remote (deployed server) url here
        },
    });

io.on("connection", (socket) => {
    console.log("connected to sockets");


        // Keep alive mechanism
        const keepAliveInterval = setInterval(() => {
            socket.emit('pingKeepAlive');
        }, 10000); // per 10 seconds
    
        socket.on('pongKeepAlive', () => {
            console.log('Received keep alive pong from client');
        });
    
        socket.on('disconnect', () => {
            clearInterval(keepAliveInterval); // if user disconnets stop keep alive
        });


    socket.on('setup', (userId) => {
        socket.join(userId);
        socket.broadcast.emit('online-users', userId)
        console.log(userId);

    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User Joined Room :' + room);
    });

    socket.on("typing", (room) => {
        console.log('typing');
        console.log(room);
        socket.to(room).emit("typing", room)
    });
    socket.on("stop typing", (room) => {
        console.log('stopped typing');
        console.log(room);
        socket.to(room).emit("stop typing", room)
    });


    socket.on("new message", async (newMessageReceived) => {

        var chat = newMessageReceived.chat;
        var room = chat._id;

        var sender = newMessageReceived.sender;
        var receiver = newMessageReceived.receiver;
        
        const receiverId = receiver
        const isReceiverOnline = !!io.sockets.adapter.rooms.get(receiverId);

        if (!isReceiverOnline) {
            const tokens = await getUserTokens(receiverId);
            console.log(`receiver: ${receiverId} is not online, sending notification...`)
            sendNotification(tokens, `You have a new message from ${sender.username}`,sender.profile);
        }

        if (!sender || !sender._id) {
            console.log("Sender not defined or missing _id property");
            return;
        }

        var senderId = sender._id;
        console.log(senderId + "sender");
        const users = chat.users;

        if (!users) {
            console.log("Chat users not defined");
            return;
        }

        socket.to(room).emit("message received", newMessageReceived);
        socket.to(room).emit("message sent", "New Message");

    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userId);
    });
})