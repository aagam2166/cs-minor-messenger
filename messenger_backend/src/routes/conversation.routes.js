import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getOrCreateConversation,
  getUserConversations,
  getConversationById,
  getUserConversationsWithLastMessage
} from "../controllers/conversation.controller.js";

const router = Router();

// create or get conversation
router.post("/:userId", verifyJWT, getOrCreateConversation);

// inbox (basic)
router.get("/", verifyJWT, getUserConversations);

// inbox WITH lastMessage (NEW)
router.get("/inbox", verifyJWT, getUserConversationsWithLastMessage);

// get single conversation
router.get("/:conversationId", verifyJWT, getConversationById);

export default router;
