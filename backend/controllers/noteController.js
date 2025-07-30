import Note from "../models/Note.js";

export const saveNote = async (req, res) => {
  const { roomId, feedback } = req.body;

  if (!roomId || !feedback) {
    return res.status(400).json({ error: "Room ID and feedback are required." });
  }

  try {
    const note = await Note.findOneAndUpdate(
      { roomId },
      { feedback },
      { upsert: true, new: true }
    );
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to save note." });
  }
};

export const getNote = async (req, res) => {
  const { roomId } = req.params;

  try {
    const note = await Note.findOne({ roomId });
    res.status(200).json(note || {});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch note." });
  }
};
