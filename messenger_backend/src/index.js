import dotenv from "dotenv";
dotenv.config();
import http from "http";
import {Server} from "socket.io";
export let io;


import {connectDB} from "../src/db/index.js"


import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

const httpServer = http.createServer(app);

io = new Server(httpServer,{
  cors: {
    origin: "http://localhost:5173",
    credentials: true

  }
});

io.on("connection", (socket) => {
  console.log("🔌 socket connected:", socket.id);

  // track joined conversations PER SOCKET
  socket.joinedConversations = new Set();

  socket.on("join-conversation", (conversationId) => {
    if (!conversationId) return;

    // 🛑 prevent duplicate joins
    if (socket.joinedConversations.has(conversationId)) {
      return;
    }

    socket.join(conversationId);
    socket.joinedConversations.add(conversationId);

    console.log(
      `📥 socket ${socket.id} joined conversation ${conversationId}`
    );
  });

  socket.on("disconnect", () => {
    console.log("❌ socket disconnected:", socket.id);
  });
});



connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("db connection failed", err);
  });