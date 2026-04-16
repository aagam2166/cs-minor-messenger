import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId)=>{
  try{
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({validateBeforeSave: false})

      return {accessToken,refreshToken}
  }
  catch(error){
    throw new ApiError(500,"Something went wrong while generating refresh and access token")
  }
}

const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const currentUserId = req.user._id;

  if (!query || query.trim() === "") {
    throw new ApiError(400, "Search query is required");
  }

  const users = await User.find({
    _id: { $ne: currentUserId }, // exclude self
    username: {
      $regex: query,
      $options: "i", // case-insensitive
    },
  })
    .select("_id username fullName profilePic")
    .limit(10)
    .lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      users,
      "Users fetched successfully"
    )
  );
});

const registerUser = asyncHandler(async(req,res)=>{
    if(!req.body){
        throw new ApiError(400,"Request body is missing")
    }

    //now we extract data
    const {fullName, email, username, password} = req.body;

    //validating fields
    if ([fullName, email, username, password].some(field => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
    }

    //checking if user exists

    const existingUser = await User.findOne({
    $or: [{ username }, { email }]
    });

    if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
    }

    let profilePic = "";

    if(req.file?.path){
        const uploaded = await uploadToCloudinary(req.file.path,{
            folder: "messenger/users/avatars"
        });

        if(!uploaded || !uploaded.secure_url){
            throw new ApiError(500, "Avatar upload failed");
        }

        profilePic = uploaded.secure_url;
    }

    const user = await User.create({
        fullName,
        username,
        email,
        password,
        profilePic
    });

    //removing sensitive fields
    const safeUser = await User.findById(user._id).select("-password -refreshToken");

    if(!safeUser){
        throw new ApiError(400,"User creation failed");
    }

    res.status(201).json(new ApiResponse(201,safeUser,"User registered successfully"));

    



});

const loginUser = asyncHandler(async (req, res) => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🟡 [LOGIN] Incoming login request");

  // 1️⃣ Check request body
  console.log("🟡 [LOGIN] req.body:", req.body);

  const { username, email, password } = req.body;

  if (!password || (!username && !email)) {
    console.log("🔴 [LOGIN] Missing credentials");
    throw new ApiError(400, "Username or email and password are required");
  }

  // 2️⃣ Find user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  console.log("🟡 [LOGIN] User found:", !!user);

  if (!user) {
    console.log("🔴 [LOGIN] User not found");
    throw new ApiError(404, "User does not exist");
  }

  // 3️⃣ Verify password
  const isPasswordValid = await user.verifyPassword(password);
  console.log("🟡 [LOGIN] Password valid:", isPasswordValid);

  if (!isPasswordValid) {
    console.log("🔴 [LOGIN] Invalid password");
    throw new ApiError(401, "Invalid credentials");
  }

  // 4️⃣ Generate tokens
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  console.log("🟢 [LOGIN] accessToken generated:", !!accessToken);
  console.log("🟢 [LOGIN] refreshToken generated:", !!refreshToken);

  // 5️⃣ Fetch safe user object
  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");

  console.log(
    "🟢 [LOGIN] Safe user object prepared:",
    loggedInUser?._id?.toString()
  );

  // 6️⃣ Cookie options (UNCHANGED)
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  console.log("🟢 [LOGIN] Setting cookies with options:", cookieOptions);
  console.log("🟢 [LOGIN] Sending response with cookies + JSON token");

  // 7️⃣ Send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)   // kept
    .cookie("refreshToken", refreshToken, cookieOptions) // kept
    .json(
      new ApiResponse(
        200,
        {
          accessToken, // ✅ frontend can now store token
          user: loggedInUser,
        },
        "User logged in successfully"
      )
    );
});


const logOut = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

        const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict"
};


    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used")
    }

    const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict"
};


    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }
})

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const user = await User.findById(userId).select(
    "_id username email"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User fetched")
  );
});


const changeCurrentPassword = asyncHandler(async(req,res)=>{
  const {oldPassword, newPassword,confirmNewPassword} = req.body

  const user = await User.findById(req.user?._id)

  const isPasswordCorrect = await user.verifyPassword(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400, "Invalid old password")
  }

  if(newPassword!==confirmNewPassword){
    throw new ApiError(400,"New password and confirm new password do not match")
  }

  if(newPassword===oldPassword){
    throw new ApiError(400,"New password can't be old password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false})

  return res.
  status(200)
  .json(new ApiResponse(200,{},"Password changed successfully"))

})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "current user fetched successfully")
    )
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
  if(!req.body){
    throw new ApiError(400,"Req body cannot be empty");
  }
  const {fullName, email} = req.body

  if(!fullName&&!email){
    throw new ApiError(400,"All fields are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email
      }
    },
    {new: true}
 ).select("-password")

 return res
 .status(200)
 .json(new ApiResponse(200,user,"Account details updated successfully"))


})

const toggleAccountType = asyncHandler(async (req, res) => {
  // 1️⃣ fetch the authenticated user
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 2️⃣ toggle account type
  user.accountType =
    user.accountType === "public" ? "private" : "public";

  // 3️⃣ save without re-validating password etc.
  await user.save({ validateBeforeSave: false });

  // 4️⃣ respond
  return res.status(200).json(
    new ApiResponse(
      200,
      { accountType: user.accountType },
      `Account is now ${user.accountType}`
    )
  );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const newProfilePicPath = req.file?.path;

  if (!newProfilePicPath) {
    throw new ApiError(400, "Profile picture is missing");
  }

  const avatar = await uploadToCloudinary(newProfilePicPath);

  if (!avatar?.url) {
    throw new ApiError(400, "Error uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { profilePic: avatar.url } },
    { new: true }
  ).select("-password");

  return res.status(200).json(
    new ApiResponse(200, user, "Avatar updated successfully")
  );
});

const getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const user = await User.findOne({ username })
    .select("_id username fullName profilePic")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      user,
      "User fetched successfully"
    )
  );
});



export {registerUser,searchUsers,loginUser,logOut,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,toggleAccountType,updateUserAvatar,getUserById,getUserByUsername};