import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { config } from "dotenv";
import cors from 'cors';
import http from 'http';
import { Server } from "socket.io";

// Import your routes here
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import UploadRoute from './Routes/UploadRoute.js';
import AdminRoute from './Routes/AdminRoute.js';
import PostRoute from './Routes/PostRoute.js';
import ChatRoute from './Routes/ChatRoute.js';
import MessageRoute from './Routes/MessageRoute.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {      
 cors: {
    origin: "https://circlify-theta.vercel.app",
 },
});

app.use(express.static('public'));
app.use('/images', express.static("images"));

app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use((req, res, next) => {
 res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
 res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
 next();
});

config();
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => {
    console.log("MongoDB Connected Successfully!!!");
    server.listen(process.env.PORT, () => console.log("Server Started"));
 })
 .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/upload', UploadRoute);
app.use('/post', PostRoute);
app.use('/', AdminRoute);
app.use('/chat', ChatRoute);
app.use('/message', MessageRoute);

let activeUsers = [];

io.on("connection", (socket) => {
 console.log("A user connected");

 socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log("Connected Users", activeUsers);
    io.emit("get-users", activeUsers);
 });

 socket.on("send-message", (data) => {
    const { receiverId, senderId, text, senderUsername } = data;
    console.log("Sending from Socket to:", receiverId);
    console.log("Data:", data);
    if (receiverId) {
      const user = activeUsers.find((user) => user.userId === receiverId);
      if (user) {
        io.to(user.socketId).emit("receive-message", data);
        io.to(user.socketId).emit("receive-notification", {
          message: `You have a new message from ${senderUsername}: ${text}`,
        });
      } else {
        console.log("User not found");
      }
    } else {
      console.log("Receiver ID is null");
    }
 });

 socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
 });
});
