import { Router } from "express";
import {
  likePost,
  unlikePost,
  getLikeStatus,
  getLikesCount,
  getLikes
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// like / unlike
router.post(
  "/posts/:postId/like",
  verifyJWT,
  likePost
);

router.delete(
  "/posts/:postId/like",
  verifyJWT,
  unlikePost
);

// status
router.get(
  "/posts/:postId/like/status",
  verifyJWT,
  getLikeStatus
);

// counts
router.get(
  "/posts/:postId/likes/count",
  verifyJWT,
  getLikesCount
);

// list users who liked
router.get(
  "/posts/:postId/likes",
  verifyJWT,
  getLikes
);

export default router;
