import express from "express";
import {createServer} from "node:http";

import { Server } from "socket.io";
import mongoose from "mongoose";

import cors from "cors";
import connectToSocket from "./controllers/socketmanager.js";
 
import userRoute from "./routes/usersroutes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server); //io stand for socket

app.set("port",(process.env.port || 8000));

app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({limit:"100kb", extended: true }));

const start = async () => {
    const connectionDB = await mongoose.connect("mongodb+srv://Himanshu:Bab212him@cluster0.dmxqpyl.mongodb.net/");
    console.log("Database connection string:", connectionDB);
    server.listen(app.get("port"), () => {
        console.log(`Server is running on port ${app.get("port")}`);
    });
}

start();