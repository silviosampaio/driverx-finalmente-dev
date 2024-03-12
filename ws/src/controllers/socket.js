const socket = (io) => {
  io.sockets.on('connection', function (socket) {
    socket.on('join-room', function (room) {
      console.log(`join-room ${room}`);
      socket.join(room);
    });
  });
};

module.exports = socket;
