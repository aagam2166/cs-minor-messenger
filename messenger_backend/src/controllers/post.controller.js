import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

const createPost = asyncHandler(async (req, res) => {
  const localImagePath = req.file?.path;

  if (!localImagePath) {
    throw new ApiError(400, "Image is missing");
  }

  const uploadedImage = await uploadToCloudinary(localImagePath, {
    folder: "messenger/posts"
  });

  if (!uploadedImage || !uploadedImage.secure_url) {
    throw new ApiError(400, "Image upload failed");
  }

  const post = await Post.create({
    owner: req.user._id,
    image: uploadedImage.secure_url,
    caption: req.body?.caption || ""
  });

  return res.status(201).json(
    new ApiResponse(201, post, "Post created successfully")
  );
});

const deletePost = asyncHandler(async(req,res)=>{
    const {postId} = req.params;

    if(!postId){
        throw new ApiError(400,"PostId is required");

    }

    const post = await Post.findById(postId);

    if(!post){
        throw new ApiError(404,"Post not found");
    }

    //now we check ownership for security purposes
    if(post.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"How dare you delete someone's else's post");
    }

    await post.deleteOne();

    return res.status(200).json(
        new ApiResponse(200,{},"Post deleted successfully")
    );
});

const getMyPosts = asyncHandler(async(req,res)=>{
    const posts = await Post.find({owner: req.user._id}).sort({createdAt: -1});

    return res.status(200).json(
        new ApiResponse(200, posts, "Fetched your posts successfully")
    )
});

export {createPost,deletePost,getMyPosts};