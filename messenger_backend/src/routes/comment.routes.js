import { Router } from "express";
import {
  addComment,
  getComments,
  getCommentsCount,
  editComment,
  deleteComment
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * Add a comment to a post
 * GET comments of a post (with pagination)
 */
router.route("/posts/:postId/comments")
  .post(verifyJWT, addComment)
  .get(verifyJWT, getComments);

/**
 * Get comments count of a post
 */
router.get(
  "/posts/:postId/comments/count",
  verifyJWT,
  getCommentsCount
);

/**
 * Edit a comment
 * Delete a comment
 */
router.route("/comments/:commentId")
  .patch(verifyJWT, editComment)
  .delete(verifyJWT, deleteComment);

export default router;
