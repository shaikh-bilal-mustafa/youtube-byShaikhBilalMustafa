import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
// import jwt from "jsonwebToken"

const registerUser = asyncHandler(async (req: any, res: any) => {
    
  const {username, email, password, fullName } = req.body;
      console.log(username)
  if (!username || !email || !password || !fullName) {
  throw new ApiError(400, "All fields are required");
}
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");

  }

  const files = req.files as {
  avatar?: Express.Multer.File[];
  coverImage?: Express.Multer.File[];
};
  const avatarLocalPath = files.avatar?.[0]?.path
  const coverImageLocalPath = files?.coverImage?.[0]?.path; 
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  if (!avatar) {
        throw new ApiError(500, "Avatar file is required")
    }
  let coverImage;
  if (coverImageLocalPath) {
  coverImage = await uploadOnCloudinary(coverImageLocalPath);
}
   
  
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});
const generateAccessAndRefereshTokens = async(userId:string) =>{
    try {
        const user = await User.findById(userId)
        if(!user) throw new ApiError(400, "user not find");

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}
export { registerUser ,generateAccessAndRefereshTokens}
