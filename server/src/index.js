const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidV4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Handle socket connection
io.on("connection", (socket) => {
  console.log("New user connected: " + socket.id);

  // Join a room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);

    // Broadcast changes to other users in the room
    socket.on("code-change", (code) => {
      socket.to(roomId).emit("code-update", code);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });
  });
});

// Optional: create a new room
app.get("/new-room", (req, res) => {
  res.json({ roomId: uuidV4() });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
