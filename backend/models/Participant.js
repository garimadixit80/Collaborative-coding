import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  roomId: String,
  name: String,
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Participant", ParticipantSchema);
