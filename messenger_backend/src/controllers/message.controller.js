import mongoose from "mongoose";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io } from "../index.js";



const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const { conversationId } = req.params;

  const { content } = req.body;

  if (!content || !content.trim()) {
    throw new ApiError(400, "Can't send empty message");
  }

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new ApiError(400, "Invalid conversation ID");
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const isParticipant = conversation.participants.some(
  id => id.toString() === senderId.toString()
  );

  if (!isParticipant) {
    throw new ApiError(403, "You are not part of this conversation");
  }

  const message = await Message.create({
    content,
    sender: senderId,
    conversation: conversationId
  });

  conversation.updatedAt = new Date();
  await conversation.save();

  // after message is created
io.to(conversationId).emit("new-message", message);
console.log("📡 EMITTED new-message to room:", conversationId, message._id);



  return res.status(201).json(
    new ApiResponse(201, message, "Message sent successfully")
  );
});

const getMessageByConversation = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { conversationId } = req.params;
  const { page = 1, limit = 1000 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new ApiError(400, "Invalid conversation ID");
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    id => id.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw new ApiError(403, "Access denied");
  }

  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * Number(limit))
    .limit(Number(limit));

  return res.status(200).json(
    new ApiResponse(200, messages, "Messages fetched")
  );
});

export {
  sendMessage,
  getMessageByConversation
};
