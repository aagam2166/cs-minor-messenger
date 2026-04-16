import { Follow } from "../models/follow.model.js";
import { Post } from "../models/post.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getFeed = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  /* ---------------------------------------------
     1️⃣ pagination
  --------------------------------------------- */
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 20);
  const skip = (page - 1) * limit;

  /* ---------------------------------------------
     2️⃣ users I follow
  --------------------------------------------- */
  const follows = await Follow.find({ follower: userId })
    .select("following -_id");

  const followedUserIds = follows.map(f => f.following);

  if (followedUserIds.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, [], "Feed fetched successfully")
    );
  }

  /* ---------------------------------------------
     3️⃣ fetch posts
  --------------------------------------------- */
  const posts = await Post.find({
    owner: { $in: followedUserIds }
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("owner", "username avatar fullName");

  if (posts.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, [], "Feed fetched successfully")
    );
  }

  /* ---------------------------------------------
     4️⃣ extract postIds
  --------------------------------------------- */
  const postIds = posts.map(post => post._id);

  /* ---------------------------------------------
     5️⃣ likes count (bulk)
  --------------------------------------------- */
  const likesCounts = await Like.aggregate([
    { $match: { post: { $in: postIds } } },
    {
      $group: {
        _id: "$post",
        count: { $sum: 1 }
      }
    }
  ]);

  const likesCountMap = {};
  likesCounts.forEach(item => {
    likesCountMap[item._id.toString()] = item.count;
  });

  /* ---------------------------------------------
     6️⃣ comments count (bulk)
  --------------------------------------------- */
  const commentsCounts = await Comment.aggregate([
    { $match: { post: { $in: postIds } } },
    {
      $group: {
        _id: "$post",
        count: { $sum: 1 }
      }
    }
  ]);

  const commentsCountMap = {};
  commentsCounts.forEach(item => {
    commentsCountMap[item._id.toString()] = item.count;
  });

  /* ---------------------------------------------
     7️⃣ like status (for logged-in user)
  --------------------------------------------- */
  const likedPosts = await Like.find({
    post: { $in: postIds },
    likedBy: userId
  }).select("post -_id");

  const likedPostSet = new Set(
    likedPosts.map(lp => lp.post.toString())
  );

  /* ---------------------------------------------
     8️⃣ merge everything
  --------------------------------------------- */
  const enrichedPosts = posts.map(post => {
    const id = post._id.toString();

    return {
      ...post.toObject(),
      likesCount: likesCountMap[id] || 0,
      commentsCount: commentsCountMap[id] || 0,
      isLiked: likedPostSet.has(id)
    };
  });

  /* ---------------------------------------------
     9️⃣ response
  --------------------------------------------- */
  return res.status(200).json(
    new ApiResponse(200, enrichedPosts, "Feed fetched successfully")
  );
});

