import { Router } from "express";
import {
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowersCount,
  getFollowingCount,
  getFollowers,
  getFollowing
} from "../controllers/follow.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router();

router.post(
  "/users/:userId/follow",
  verifyJWT,
  followUser
);

router.delete(
  "/users/:userId/follow",
  verifyJWT,
  unfollowUser
);

router.get(
  "/users/:userId/follow/status",
  verifyJWT,
  getFollowStatus
);


router.get(
  "/users/:userId/followers/count",
  verifyJWT,
  getFollowersCount
);

router.get(
  "/users/:userId/following/count",
  verifyJWT,
  getFollowingCount
);

router.get(
    "/users/:userId/followers",
    verifyJWT,
    getFollowers
)

router.get(
    "/users/:userId/following",
    verifyJWT,
    getFollowing
)

export default router;