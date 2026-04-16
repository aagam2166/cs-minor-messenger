import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    }
    
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: 1 });




export const Message = mongoose.model("Message", messageSchema);
