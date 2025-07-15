import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  try {
    const { roomId, roomName, language, duration } = req.body;

    const newRoom = new Room({ roomId, roomName, language, duration });
    await newRoom.save();

    res.status(201).json({ message: "Room saved", room: newRoom });
  } catch (err) {
    res.status(500).json({ error: "Failed to create room", details: err.message });
  }
};
