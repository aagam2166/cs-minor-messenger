import { Router } from "express";
import {
  createPost,
  getMyPosts,
  deletePost
} from "../controllers/post.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/",
  upload.single("avatar"),
  verifyJWT,
  createPost
);

router.get("/me",verifyJWT,getMyPosts);
router.delete("/:postId",verifyJWT,deletePost);

export default router;