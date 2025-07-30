const roomParticipants = {}; // roomId => Map(socketId => { userId, name, socketInstance })

export default function setupCodeEditorSockets(io, socket, roomCodeStore) {
  // 👉 Handle user joining a room
  socket.on('join-room', ({ roomId, name }) => { // Removed userId as it's not used in frontend provided
    socket.join(roomId);
    socket.roomId = roomId; // Attach roomId to socket for easier access on disconnect
    socket.name = name; // Attach name to socket

    if (!roomParticipants[roomId]) {
      roomParticipants[roomId] = new Map();
    }

    // Add current user to room's participants map
    roomParticipants[roomId].set(socket.id, { name, socketInstance: socket }); // Store name directly

    // Send current code (if any) to the new user
    const existingCode = roomCodeStore.get(roomId);
    if (existingCode) {
      socket.emit('code-update', existingCode);
    }

    // Notify all clients in room about updated participants
    // Use `io.to(roomId)` to broadcast to everyone in the room, including the sender if desired for immediate self-update,
    // or `socket.to(roomId)` if you want to exclude the sender.
    // For participant list, it's often good to send to all to ensure consistency.
    io.to(roomId).emit(
      'participants-update',
      getParticipantsNamesList(roomId) // Use a new helper to get just names
    );

    // This event might be redundant if 'participants-update' handles it, but keep if client expects it.
    socket.emit('joined-room', {
      success: true,
      roomId,
      socketId: socket.id
    });

    console.log(`👋 ${name} joined room ${roomId}`);
  });

  // 👉 Handle code change
  socket.on('code-change', ({ roomId, code }) => {
    // Update the room's code store
    roomCodeStore.set(roomId, code);

    // Broadcast to all clients in the room including the sender
    // This is crucial for bidirectional sync and immediate feedback for the sender.
    io.to(roomId).emit('code-update', code);
    
    console.log(`📝 Code updated in room ${roomId}`);
  });

  // 👉 Handle cursor movement
  socket.on('cursor-move', ({ roomId, cursor }) => {
    // Broadcast to all other clients in the room (excluding the sender)
    // This is generally correct for cursor updates as sender doesn't need to see their own cursor echoed back.
    socket.to(roomId).emit('cursor-update', {
      socketId: socket.id,
      name: socket.name, // Use the stored name from join-room
      cursor,
    });
  });

  // 👉 Handle disconnect for code editor rooms
  socket.on('disconnect', () => {
    const { roomId } = socket; // Get roomId attached during join-room
    if (roomId && roomParticipants[roomId]) {
      const participants = roomParticipants[roomId];

      if (participants.has(socket.id)) {
        const { name } = participants.get(socket.id); // Retrieve name before deleting
        participants.delete(socket.id);

        // Notify remaining participants that a user has left
        io.to(roomId).emit('user-left', { socketId: socket.id, name }); // Optionally send name for UI
        
        // Update participant list for everyone
        io.to(roomId).emit(
          'participants-update',
          getParticipantsNamesList(roomId)
        );

        console.log(`🔴 ${name || 'Anonymous'} disconnected from room ${roomId}`);

        // Clean up if room is empty
        if (participants.size === 0) {
          delete roomParticipants[roomId];
          roomCodeStore.delete(roomId);
          console.log(`🧹 Room ${roomId} cleaned up (no participants)`);
        }
      }
    }
  });
}

// Helper to get list of participant names for the frontend
function getParticipantsNamesList(roomId) {
  const participants = roomParticipants[roomId] || new Map();
  return Array.from(participants.values()).map(p => p.name);
}

// Ensure the roomParticipants map is cleared if the server restarts or for testing,
// though in a real application, you might persist some of this.