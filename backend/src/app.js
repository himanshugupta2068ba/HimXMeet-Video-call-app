import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import connectToSocket from "./controllers/socketmanager.js";
import userRoute from "./routes/users.routes.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);
void io;

app.set("port", process.env.PORT || 8000);

const allowedOrigins = (process.env.FRONTEND_URLS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOrigin = (origin, callback) => {
  // Allow server-to-server and health-check requests without Origin header.
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error("Not allowed by CORS"));
};

app.use(cors({
  origin: corsOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.options(/.*/, cors({ origin: corsOrigin, credentials: true }));

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ limit: "100kb", extended: true }));

app.use("/api/v1/users", userRoute);
app.use("/api/v2/users", userRoute);

const start = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zoom";

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");

    server.listen(app.get("port"), () => {
      console.log(`Server is running on port ${app.get("port")}`);
    });
  } catch (error) {
    console.error("Failed to start server", error.message);
    process.exit(1);
  }
};

start();
