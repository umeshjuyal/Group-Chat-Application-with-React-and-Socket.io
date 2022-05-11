const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
// const io = socketio(server);

//for Handling CORS
//The client and server have a different origin from each other, i.e., accessing resources from a different server
//CORS comes into play to disable this mechanism and allow access to these resources. CORS will add a response header access-control-allow-origins and specify which origins are permitted. CORS ensures that we are sending the right headers.
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Create a listening event for client to join different room in our server.js:

const { addUser, removeUser } = require("./user");

// const PORT = process.env.PORT || 5000
const PORT = 5000;

io.on("connection", (socket) => {
  console.log('A Connection has been made');
  socket.on("join", ({ name, room }, callBack) => {

    const { user, error } = addUser({ id: socket.id, name, room });
    if (error) return callBack(error);

    socket.join(user.room);
    socket.emit("message", {
      user: "Admin",
      text: `Welocome to ${user.room}`,
    });

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "Admin", text: `${user.name} has joined!` });
    callBack(null);

    socket.on("sendMessage", ({ message }) => {
      io.to(user.room).emit("message", {
        user: user.name,
        text: message,
      });
    });
  });
  socket.on("disconnect", () => {
    console.log('A disconnection has been made');
    const user = removeUser(socket.id);
    console.log(user);
    io.to(user.room).emit("message", {
      user: "Admin",
      text: `${user.name} just left the room`,
    });
    console.log("A disconnection has been made");
  });
});

//for server is litening port
server.listen(PORT, () => console.log(`Server is listening to Port ${PORT}`));
