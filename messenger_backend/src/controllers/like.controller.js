import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Like} from "../models/like.model.js"

const likePost = asyncHandler(async(req,res)=>{
    const {postId} = req.params;
    const userId = req.user._id;

   


    if(!postId){
        throw new ApiError(400,"Post id is missing");
    }

    try{
        await Like.create({
            user: userId,
            post: postId
        });

    }
    catch(error){
        if(error.code===11000){
            throw new ApiError(409,"Post already Liked");
        }
        throw error;
    }

    return res.status(201).json(
        new ApiResponse(201,null,"Post liked successfully")
    );
});

const unlikePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  if (!postId) {
    throw new ApiError(400, "Post id is missing");
  }

  await Like.deleteOne({
    user: userId,
    post: postId
  });

  return res.status(200).json(
    new ApiResponse(200, null, "Post unliked successfully")
  );
});

const getLikeStatus = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  if (!postId) {
    throw new ApiError(400, "Post id is missing");
  }

  const isLiked = !!(await Like.exists({
    user: userId,
    post: postId
  }));

  return res.status(200).json(
    new ApiResponse(200, { isLiked }, "Like status fetched")
  );
});

const getLikesCount = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(400, "Post id is missing");
  }

  const likesCount = await Like.countDocuments({
    post: postId
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { likesCount },
      "Likes count fetched"
    )
  );
});

const getLikes = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  let { page = 1, limit = 10 } = req.query;

  if (!postId) {
    throw new ApiError(400, "Post id is missing");
  }

  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const likes = await Like.find({ post: postId })
    .populate("user", "username avatar fullName")
    .select("-post")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        page,
        limit,
        results: likes.length,
        likes
      },
      "Likes fetched"
    )
  );
});


export {
  likePost,
  unlikePost,
  getLikeStatus,
  getLikesCount,
  getLikes,
};
