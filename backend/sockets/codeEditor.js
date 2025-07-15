export default function setupCodeEditorSockets(io, socket) {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`🧠 User joined room: ${roomId}`);
  });

  socket.on('code-change', ({ roomId, code }) => {
    socket.to(roomId).emit('code-update', code);
  });
}
