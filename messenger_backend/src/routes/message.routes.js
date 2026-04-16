import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  sendMessage,
  getMessageByConversation
} from "../controllers/message.controller.js";

const router = Router();

// 1️⃣ send a message in a conversation
router.post("/:conversationId", verifyJWT, sendMessage);

// 2️⃣ get messages of a conversation (chat history)
router.get("/:conversationId", verifyJWT, getMessageByConversation);

export default router;
