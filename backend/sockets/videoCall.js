export default function setupVideoCallSockets(io, socket) {
  socket.on('video-offer', ({ offer }) => {
    socket.broadcast.emit('video-offer', { offer }); // you can target room here too
  });

  socket.on('video-answer', ({ answer }) => {
    socket.broadcast.emit('video-answer', { answer });
  });

  socket.on('ice-candidate', ({ candidate }) => {
    socket.broadcast.emit('ice-candidate', { candidate });
  });
}
