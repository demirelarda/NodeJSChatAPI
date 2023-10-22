# NodeJS Chat App
* This project is a production ready chat application that can be easily integrated into any application (mobile, web or desktop). 
* It is aimed to prepare a ready-made system that even someone who does not have any knowledge about backend systems can easily use. That's why I tried to prepare a detailed documentation. ([See documentation section](#documentation))

# Features
* JWT auth mechanism for a secure system
* Optimized to use as few resources as possible
* Instant message notifications with FCM
* Pagination system for messages
* Indicators such as online users, typing etc.
* Efficient use of MongoDB

# Installation
* Clone the project
* Install dependencies: `npm install`
* Create a file named `.env` in the project folder (at root level)
* You need to define 4 variables in `.env`: 

```
MONGO_URL = // You can get this by creating a DB in MongoDB (see https://www.mongodb.com/atlas/database). 
JWT_SEC = // Create a unique JWT_SECRET and put it here
SECRET = // Create a unique SECRET and put it here
PORT = // (To run tests on local. You can delete this when deploying)

```

* Create a Service Account Key JSON file in Firebase. (See https://firebase.google.com/docs/cloud-messaging/auth-server) 
And put this file to the project level folder (root level) by naming it `serviceAccountKey.json`. It will not work if you give it another name. Also you need to enable Firebase Cloud Messaging in Firebase Panel. This step is for enabling push notifications.

* To test the project on local: To test the project locally, specify the PORT number in the .env and you can run tests in Postman or any other environment using the root url `localhost:3000/api/v1` (assuming you set the port number to 3000).

* You also need to specify an origin for socket io on the chat server. You need to add this in index.js where `const io` is specified. For example to set the socket origins to localhost port 3000, use: `origin: "http:localhost:3000"`

* And you are good to go! Run `npm start` to start the server on local

# Documentation

* Documentation on how to use endpoints is available at `http://localhost:{YOUR_PORT_NUMBER}/api/v1/docs`


# Deployment
* You can deploy to any service. After deploying, don't forget to add the url you deployed to the `origin` section in `const io` in the `index.js` for the sockets to work correctly. For example, if the url you deployed is: https://testchat.app/myappetc/, you need to write this url in the `origin` section.


