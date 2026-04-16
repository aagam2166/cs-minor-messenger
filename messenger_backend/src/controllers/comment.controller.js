import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Comment} from "../models/comment.model.js";
import { Post } from "../models/post.model.js";

const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;
  const { content } = req.body;

  if (!postId) {
    throw new ApiError(400, "Post id is missing");
  }

  if (!content || !content.trim()) {
    throw new ApiError(400, "You cannot add an empty comment");
  }

  try {
    await Comment.create({
      author: userId,
      post: postId,
      content
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "You have already commented on this post");
    }
    throw error;
  }

  return res.status(201).json(
    new ApiResponse(201, null, "Comment added successfully")
  );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!commentId) {
    throw new ApiError(400, "Comment id is missing");
  }

  // 1️⃣ Find the comment
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // 2️⃣ Find the post related to this comment
  const post = await Post.findById(comment.post);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // 3️⃣ Permission check
  const isCommentAuthor =
    comment.author.toString() === userId.toString();

  const isPostOwner =
    post.owner.toString() === userId.toString();

  if (!isCommentAuthor && !isPostOwner) {
    throw new ApiError(
      403,
      "You are not allowed to delete this comment"
    );
  }

  // 4️⃣ Delete comment
  await comment.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, null, "Comment deleted successfully")
  );
});

const getCommentsCount = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(400, "Post id is missing");
  }

  const commentsCount = await Comment.countDocuments({
    post: postId
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { commentsCount },
      "Comments count fetched"
    )
  );
});

const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  let { page = 1, limit = 10 } = req.query;

  if (!postId) {
    throw new ApiError(400, "Post id is missing");
  }

  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const comments = await Comment.find({ post: postId })
    .populate("author", "username avatar fullName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        page,
        limit,
        results: comments.length,
        comments
      },
      "Comments fetched successfully"
    )
  );
});

const editComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!commentId) {
    throw new ApiError(400, "Comment id is missing");
  }

  if (!content || !content.trim()) {
    throw new ApiError(400, "Updated comment content is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  console.log("logged in user:", userId.toString());
  console.log("comment author:", comment.author.toString());

  // ✅ CORRECT PERMISSION CHECK
  if (comment.author.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to edit this comment");
  }

  comment.content = content;
  await comment.save();

  return res.status(200).json(
    new ApiResponse(200, comment, "Comment updated successfully")
  );
});



export{
    addComment,
    deleteComment,
    getCommentsCount,
    getComments,
    editComment
}






