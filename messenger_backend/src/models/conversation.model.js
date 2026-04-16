import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
);

/**
 * Index to quickly find all conversations for a user
 * Example query:
 * Conversation.find({ participants: userId })
 */
conversationSchema.index(
  { participants: 1 },
  { unique: true }
);


export const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);
