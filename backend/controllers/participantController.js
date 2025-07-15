import Participant from "../models/Participant.js";

export const addParticipant = async (req, res) => {
  try {
    const { roomId, name } = req.body;

    const participant = new Participant({ roomId, name });
    await participant.save();

    res.status(201).json({ message: "Participant joined", participant });
  } catch (error) {
    res.status(500).json({ error: "Failed to join", details: error.message });
  }
};
