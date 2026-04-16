import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";



const getOrCreateConversation = asyncHandler(async (req, res) => {
  const userA = req.user._id;
  const userB = req.params.userId;

  // basic validation
  if (!mongoose.Types.ObjectId.isValid(userB)) {
    throw new ApiError(400, "Invalid user id");
  }

  if (userA.toString() === userB) {
    throw new ApiError(400, "Cannot create conversation with yourself");
  }

  // 1️⃣ try to find existing 1-to-1 conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [userA, userB] },
    $expr: { $eq: [{ $size: "$participants" }, 2] }
  });

  // 2️⃣ if not found, try to create
  if (!conversation) {
    try {
      conversation = await Conversation.create({
        participants: [userA, userB]
      });
    } catch (error) {
      // 3️⃣ handle race condition (duplicate key)
      if (error.code === 11000) {
        conversation = await Conversation.findOne({
          participants: { $all: [userA, userB] },
          $expr: { $eq: [{ $size: "$participants" }, 2] }
        });
      } else {
        throw error;
      }
    }
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      conversation,
      "Conversation fetched successfully"
    )
  );
});


const getUserConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const conversations = await Conversation.find({ participants: userId })
    .sort({ updatedAt: -1 })
    .select("participants updatedAt createdAt");

  return res.status(200).json(
    new ApiResponse(200, conversations, "User conversations fetched")
  );
});

const getConversationById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { conversationId } = req.params;

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

  return res.status(200).json(
    new ApiResponse(200, conversation, "Conversation fetched")
  );
});

const getUserConversationsWithLastMessage = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1️⃣ fetch all conversations of the user
  const conversations = await Conversation.find({
    participants: userId
  })
    .sort({ updatedAt: -1 })
    .lean(); // important: makes objects mutable & faster

  // 2️⃣ attach lastMessage to each conversation
  const conversationsWithLastMessage = await Promise.all(
    conversations.map(async (conversation) => {
      const lastMessage = await Message.findOne({
        conversation: conversation._id
      })
        .sort({ createdAt: -1 })
        .select("content sender createdAt")
        .lean();

      return {
        ...conversation,
        lastMessage: lastMessage || null
      };
    })
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      conversationsWithLastMessage,
      "Inbox with last message fetched"
    )
  );
});


export {
  getOrCreateConversation,
  getUserConversations,
  getConversationById,
  getUserConversationsWithLastMessage
};
