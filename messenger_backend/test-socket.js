import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("connected with id:", socket.id);

  // fake conversation id for testing
  const conversationId = "694c3af71337fb0f8cce4dc4";

  socket.emit("join-conversation", conversationId);
});
