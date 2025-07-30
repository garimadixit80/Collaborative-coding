import Room from "../models/Room.js";

// Create Room
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

// Get Room By ID
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ message: "Server error" });
  }
};
