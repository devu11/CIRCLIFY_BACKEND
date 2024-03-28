import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import AuthRoute from './Routes/AuthRoute.js';
 import UserRoute from './Routes/UserRoute.js';
 import UploadRoute from './Routes/UploadRoute.js';
 import AdminRoute from './Routes/AdminRoute.js';
 import PostRoute from './Routes/PostRoute.js'
 import ChatRoute from './Routes/ChatRoute.js'
 import MessageRoute from './Routes/MessageRoute.js'
 import cors from 'cors'
const app = express()



app.use(express.static('public'))
app.use('/images', express.static("images"))




 
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors())

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});


configDotenv();
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("MongoDB Connected Successfulyy!!!");
    app.listen(process.env.PORT, () => console.log("Server Started"));
  })
  .catch((error) => console.error("MongoDB connection error:", error));


//    routes

app.use('/auth', AuthRoute)
app.use('/user', UserRoute)
app.use('/upload',UploadRoute)
app.use('/post',PostRoute)
app.use('/',AdminRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)


