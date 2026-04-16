import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("client B connected:", socket.id);
  socket.emit("join-conversation", "694c3af71337fb0f8cce4dc4");
});

socket.on("new-message", (message) => {
  console.log("📨 client B received message:", message.content);
});
