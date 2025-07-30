// server.js (excerpt)
import 'dotenv/config';
import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";

// Assuming these paths are correct
import codeRoutes from "./routes/codeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import participantRoutes from "./routes/participantRoutes.js"; // This will be a function now
import setupCodeEditorSockets from "./sockets/codeEditor.js";

import setupWhiteboardSockets from "./sockets/whiteboard.js";
import judge from "./routes/judgeRoutes.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 🌐 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// 🛠️ Middlewares
app.use(
  cors({
    origin: "https://codesync0.netlify.app",
    credentials: true,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// 🧠 In-memory Stores
const roomCodeStore = new Map();  // For code syncing
const participants = {};          // socket.id -> { name, roomId, socketId }

// 📦 API Routes
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully.");
});


app.use("/api/code", codeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/rooms", roomRoutes);
// Pass 'io' and 'participants' to the participantRoutes as a function
app.use("/api/participant", participantRoutes(io, participants)); // <--- CHANGE HERE
app.use("/api/judge", judge);
app.use("/api/notes", noteRoutes);


// ⚡ Socket.IO Setup (No changes needed in this block for the "Guest" issue, it's already correct)
io.on("connection", (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);

  // 🧑‍💻 Join Room
  socket.on("joinRoom", ({ name, roomId }) => {
    socket.join(roomId);
    participants[socket.id] = { name, roomId, socketId: socket.id };

    const roomParticipants = Object.values(participants).filter(
      (p) => p.roomId === roomId
    );
    console.log(`Socket.IO joinRoom: ${name} joined room ${roomId}. Current participants:`, roomParticipants.map(p => p.name));
    io.to(roomId).emit("updateParticipants", roomParticipants);
  });

  // ❌ Leave Room (Manual)
  socket.on("leaveRoom", () => {
    const participant = participants[socket.id];
    if (participant) {
      const { roomId } = participant;
      delete participants[socket.id];

      const updatedList = Object.values(participants).filter(
        (p) => p.roomId === roomId
      );
      io.to(roomId).emit("updateParticipants", updatedList);
      console.log(`Socket.IO leaveRoom: ${participant.name || 'Unknown'} left room ${roomId}. Remaining:`, updatedList.map(p => p.name));
    }
  });

  // ❌ Leave Room (Disconnect)
  socket.on("disconnect", () => {
    const participant = participants[socket.id];
    if (participant) {
      const { roomId } = participant;
      delete participants[socket.id];

      const updatedList = Object.values(participants).filter(
        (p) => p.roomId === roomId
      );
      io.to(roomId).emit("updateParticipants", updatedList);
      console.log(`🔴 Disconnected: ${participant.name || 'Unknown'} from room ${roomId}. Remaining:`, updatedList.map(p => p.name));
    }
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });

  // 🧠 Setup Feature-specific Sockets
  setupCodeEditorSockets(io, socket, roomCodeStore);
  
  setupWhiteboardSockets(io, socket);
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
console.log(`🚀 Server running on port ${PORT}`)
);