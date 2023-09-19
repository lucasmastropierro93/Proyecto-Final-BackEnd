const { chatService } = require("../service/service");

const socketChat = (io) => {
  let messages = [];
  io.on("connection", socket => {
    console.log("Nuevo cliente conectado al chat");
    socket.on("message", async (data) => {
      try {
        await chatService.saveMessages(data);
        const messages = await chatService.getMessages();

        io.emit("messageLogs", messages);
      } catch (error) {
        console.log("error en chat");
      }
    });
    socket.on("authenticated", data => {
      socket.broadcast.emit("newUserConnected", data);
    });
  });
};

module.exports = { socketChat };
