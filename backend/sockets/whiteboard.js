module.exports = (io, socket) => {
  socket.on("draw", ({ roomId, data }) => {
    socket.to(roomId).emit("draw", data);
  });
};
