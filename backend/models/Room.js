import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomId: String,
  roomName: String,
  language: String,
  duration: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Room", RoomSchema);
