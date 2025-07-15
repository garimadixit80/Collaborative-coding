const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema({
  participants: [String],
  feedback: String,
  duration: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Interview", InterviewSchema);
