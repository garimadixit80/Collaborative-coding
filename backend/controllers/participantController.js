// controllers/participantController.js

// Assuming you have a Room model if you store participants in the DB
import Room from '../models/Room.js'; // Adjust path as per your project structure

// This function now accepts io and participants from the route
export const addParticipant = async (req, res, io, participants) => {
    const { roomId, name, language } = req.body; // language is sent by client, but not used in participants map currently

    if (!roomId || !name) {
        return res.status(400).json({ message: "Room ID and name are required." });
    }

    try {
        const upperCaseRoomId = roomId.toUpperCase();

        // ✅ Step 1: Optional - Update your database (Room model) if you persist participants
        // This part depends on how your `Room` model is structured.
        // Example: Add participant to a 'currentParticipants' array in the Room document
        const room = await Room.findOneAndUpdate(
            { roomId: upperCaseRoomId },
            { $addToSet: { 
                currentParticipants: { name, joinedAt: new Date() } // Add participant to DB (if applicable)
            }},
            { new: true, upsert: false } // upsert: false means it won't create if room doesn't exist
        );

        if (!room) {
            return res.status(404).json({ message: `Room ${upperCaseRoomId} not found.` });
        }
        
        // At this point, the participant's name is saved in the DB (if you added that logic).
        // However, the `participants` *in-memory* map is what the Socket.IO `updateParticipants`
        // event uses. This map is updated when the client's socket connects and emits "joinRoom".

        // For robustness, and to cover cases where the HTTP POST happens before the socket
        // fully establishes and sends `joinRoom`, we can optimistically add a placeholder
        // to the in-memory `participants` if it's not already there.
        // HOWEVER, the `socket.on("joinRoom")` in `server.js` is designed to be the
        // single source of truth for the *real-time active* participant list.
        // The most reliable way for this to work is:
        // 1. Client sends HTTP POST to validate/save to DB.
        // 2. Client then connects socket and sends `socket.emit("joinRoom", { name, roomId })`.
        // 3. `server.js`'s `socket.on("joinRoom")` handler updates `participants` and broadcasts.

        // So, for the `addParticipant` controller specifically, its main role is to handle
        // the HTTP request for initial joining/validation/DB persistence.
        // It *doesn't* need to manipulate the `participants` map or emit a socket event here,
        // because the client will immediately follow up with a `socket.emit("joinRoom")`
        // which *will* correctly update the `participants` map and trigger the `updateParticipants` broadcast.

        // This controller's primary success response:
        res.status(200).json({ 
            message: "Participant join initiated successfully.", 
            roomId: upperCaseRoomId,
            name: name // Return the name for client confirmation
        });

    } catch (error) {
        console.error("Error adding participant:", error);
        res.status(500).json({ message: "Server error during participant join." });
    }
};


// This function also needs access to 'participants' if it's to return in-memory list
export const getParticipants = async (req, res, participants) => {
    const { roomId } = req.query; // Expecting roomId as a query parameter
    if (!roomId) {
        return res.status(400).json({ message: "Room ID is required as a query parameter." });
    }

    try {
        const upperCaseRoomId = roomId.toUpperCase();

        // Filter the in-memory `participants` object by roomId
        const roomParticipants = Object.values(participants).filter(
            (p) => p.roomId === upperCaseRoomId
        );

        // Optionally, you might also fetch from your database if you want a complete historical list
        // const roomFromDb = await Room.findOne({ roomId: upperCaseRoomId });
        // if (!roomFromDb) {
        //     return res.status(404).json({ message: `Room ${upperCaseRoomId} not found.` });
        // }
        // const dbParticipants = roomFromDb.currentParticipants || []; // Or whatever your field is

        // You'll need to decide if the GET request returns:
        // A) Only active participants from `participants` (real-time view)
        // B) All participants ever joined from DB (historical view)
        // C) A combination.
        // For "who is currently in the room", the `participants` map is best.
        
        res.status(200).json(roomParticipants); // Returning the in-memory list
    } catch (error) {
        console.error("Error fetching participants:", error);
        res.status(500).json({ message: "Server error fetching participants." });
    }
};