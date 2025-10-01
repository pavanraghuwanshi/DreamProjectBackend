import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { dbConnections } from "./Database/db.js";

// import userRoute from "./Routes/userlogin.route.js";
import animalVideoImagesRoute from "./Routes/video.route.js";

import dotenv from "dotenv";

import compression from "compression";
import { setupSocket } from "./Utils/socket/socket.js";

dotenv.config();

const app = express();
const server = createServer(app);
app.use(compression());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "This is an Dream Project Backend Server",
    status: 200,
    statusText: "OK",
  });
});

// Use routes

// app.use("/auth", userRoute);
app.use("/api", animalVideoImagesRoute);



setupSocket(server);


const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  try {
    console.log(`Server is listening on port ${PORT}`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
});