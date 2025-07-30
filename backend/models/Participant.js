import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Participant", ParticipantSchema);
