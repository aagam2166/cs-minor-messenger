import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true
    }
  },
  { timestamps: true }
);

commentSchema.index(
  { author: 1, post: 1 },
  { unique: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
