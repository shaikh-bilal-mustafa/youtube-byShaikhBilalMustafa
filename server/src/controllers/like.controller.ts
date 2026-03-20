import { Like }  from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleLike = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  if(!userId) {
    throw new ApiError(401, "Login required");  
  }
  const { videoId } = req.params;
  if(!videoId) {
    throw new ApiError(400, "Video ID is required");  
  }

  const existingLike = await Like.findOne({
    likedBy: userId,
    video: videoId,
  });

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
    return res.json(new ApiResponse(200, "Unliked video"));
  }

  await Like.create({
    likedBy: userId,
    video: videoId,
  });

  res.json(new ApiResponse(200, "Liked video"));
});
 const getLikeCount = asyncHandler(async (req:Request, res:Response) => {
  
  const { videoId } = req.params;
    if(!videoId) {
    throw new ApiError(400, "Video ID is required");  
  }

  const count = await Like.countDocuments({ video: videoId });
  
  res.json(new ApiResponse(200 , { count }, "Like count fetched"));
});
const getLikeStatus = asyncHandler(async (req:Request, res:Response) => {
  const userId = req.user._id;
   if(!userId) {
    throw new ApiError(401, "Login required");  
  }
  const { videoId } = req.params;
  if(!videoId) {
    throw new ApiError(400, "Video ID is required");  
  }
  const liked = await Like.exists({
    likedBy: userId,
    video: videoId,
  });

  res.json(new ApiResponse(200, { liked: !!liked }, "Like status"));
});
export { toggleLike, getLikeCount, getLikeStatus };