import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Follow } from "../models/follow.model.js";

const followUser = asyncHandler(async (req, res) => {
  const followerId = req.user?._id;
  const { userId: followingId } = req.params;

  if (!followerId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!followingId) {
    throw new ApiError(400, "User to follow is missing");
  }

  if (followerId.equals(followingId)) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  try {
    await Follow.create({
      follower: followerId,
      following: followingId
    });

    return res.status(201).json(
      new ApiResponse(201, null, "User followed successfully")
    );
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(400, "You are already following this user");
    }
    throw error;
  }
});

const unfollowUser = asyncHandler(async (req, res) => {
  const followerId = req.user?._id;
  const { userId: followingId } = req.params;

  if (!followerId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!followingId) {
    throw new ApiError(400, "User to unfollow is missing");
  }

  const result = await Follow.deleteOne({
    follower: followerId,
    following: followingId
  });

  if (result.deletedCount === 0) {
    throw new ApiError(400, "You are not following this user");
  }

  return res.status(200).json(
    new ApiResponse(200, null, "User unfollowed successfully")
  );
});

const getFollowStatus = asyncHandler(async (req, res) => {
  const viewerId = req.user?._id;
  const { userId: targetUserId } = req.params;

  if (!viewerId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!targetUserId) {
    throw new ApiError(400, "Target user is missing");
  }

  const isFollowing = await Follow.exists({
    follower: viewerId,
    following: targetUserId
  });

  return res.status(200).json(
    new ApiResponse(200, { isFollowing: !!isFollowing }, "Follow status fetched")
  );
});

const getFollowersCount = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User id is missing");
  }

  const followersCount = await Follow.countDocuments({
    following: userId
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { followersCount },
      "Followers count fetched"
    )
  );
});

const getFollowingCount = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User id is missing");
  }

  const followingCount = await Follow.countDocuments({
    follower: userId   // ✅ FIXED
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { followingCount },
      "Following count fetched"
    )
  );
});

const getFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User id is missing");
  }

  const followers = await Follow.find({ following: userId })
    .populate("follower", "username avatar fullName")
    .select("-following");

  return res.status(200).json(
    new ApiResponse(200, followers, "Followers fetched")
  );
});

const getFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User id is missing");
  }

  const following = await Follow.find({ follower: userId })
    .populate("following", "username avatar fullName")
    .select("-follower");

  return res.status(200).json(
    new ApiResponse(200, following, "Following fetched")
  );
});



export {
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowersCount,
  getFollowingCount,
  getFollowers,
  getFollowing
};
