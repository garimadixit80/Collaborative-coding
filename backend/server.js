import 'dotenv/config';
import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";


import codeRoutes from "./routes/codeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import participantRoutes from "./routes/participantRoutes.js";
import setupCodeEditorSockets from "./sockets/codeEditor.js";
import setupVideoCallSockets from "./sockets/videoCall.js"; // if used
import setupWhiteboardSockets from "./sockets/whiteboard.js"; // if used
import judge from "./routes/judgeRoutes.js"


const app = express();
const server = http.createServer(app);

// 🔌 Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // update with frontend origin in prod
    methods: ["GET", "POST"],
  },
});

// 🌐 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// 🛠️ Middlewares
app.use(cors());
app.use(express.json());

// 📦 API Routes
app.use("/api/code", codeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/participant", participantRoutes);
app.use('/api/judge', judge);

// ⚡ Socket.IO Real-time Events
io.on("connection", (socket) => {
  console.log("🟢 New client connected");

  setupCodeEditorSockets(io, socket);       // 🔄 Real-time code sharing
  setupVideoCallSockets(io, socket);        // 📹 Optional: video call logic
  setupWhiteboardSockets(io, socket);       // ✍️ Optional: whiteboard logic

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
