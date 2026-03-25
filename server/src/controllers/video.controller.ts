import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video, IVideo } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateThumbnail, getVideoDuration } from "../utils/ffmpeg.js";
import fs from "fs";
import path from "path";
import type { QueryFilter } from "mongoose";
import { request } from "http";
import mongoose from "mongoose";
// import { processVideo } from "../utils/ffmpeg.js";

const UploadVideo = asyncHandler(async (req: Request, res: Response) => {
  const { title, isPublished } = req.body;
  if (!title || !isPublished) {
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Temp file cleanup failed:", err);
      });
    }
    throw new ApiError(400, "Missing required field title or isPublished");
  }

  const files = req.files as {
    videoFile?: Express.Multer.File[];
    thumbnailUrl?: Express.Multer.File[];
  };
  if (!files.videoFile || files.videoFile.length === 0) {
    throw new ApiError(400, "Video file is required");
  }
  let thumbnailPath: string;
  if (!files.thumbnailUrl || files.thumbnailUrl.length === 0) {
    thumbnailPath = await generateThumbnail(files.videoFile[0].path);
  } else {
    thumbnailPath = files.thumbnailUrl[0].path;
  }
  const videoFilePath = path.resolve(files.videoFile?.[0].path);

  let duration: Number;
  try {
    console.log("Video path:", videoFilePath);
    console.log("Exists:", fs.existsSync(videoFilePath));
    duration = await getVideoDuration(files.videoFile[0].path);
  } catch (error) {
    throw new Error("Failed to get video duration");
  }

  let videofile;
  if (videoFilePath) {
    videofile = await uploadOnCloudinary(videoFilePath);
  }
  if (!videofile) {
    throw new ApiError(500, "Video upload failed");
  }
  let thumbnailUrl;
  if (thumbnailPath) {
    thumbnailUrl = await uploadOnCloudinary(thumbnailPath);
  }

  const videoData = await Video.create({
    videoFile: videofile.url,
    thumbnailUrl: thumbnailUrl?.url || "",
    title,
    duration: duration ? Number(duration) : 0,
    views: 0,
    isPublished: isPublished ? Boolean(isPublished) : false,
    uploadedBy: req.user._id,
  });
  const createdVideo = await Video.findById(videoData._id).select("-owner");
  if (!createdVideo) {
    throw new ApiError(500, "Video creation failed");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdVideo, "Video uploaded successfully"));
});
const getVideos = asyncHandler(async (req: Request, res: Response) => {
  req.params;
  const videos =
    (await Video.find().select("-owner").sort({ createdAt: -1 }).limit(6)) ||
    "no videos found";
  console.log(req.params);
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});
const getRandomVideos = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 6;
  const videos =
    (await Video.aggregate([
      { $match: { isPublished: true } },
      { $sample: { size: limit } },
    ])) || "no videos found";
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Random Videos fetched successfully"));
});
const getVideoBySearch = asyncHandler(async (req: Request, res: Response) => {
  const search = typeof req.query.query === "string" ? req.query.query : "";
  console.log(req.query.query);
  if (!search.trim()) {
    throw new ApiError(400, "Search query is required");
  }
  const regex = new RegExp(search, "i"); // case-insensitive search
  const videos = await Video.find({ isPublished: true })
    .or([{ title: regex }, { description: regex }])
    .select("-__v");
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});
const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.uploadedBy.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to delete this video");
  }
  await Video.deleteOne({ _id: videoId }); //want to lern in detail
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
});
const getAllVideos = asyncHandler(async (req: Request, res: Response) => {
  const videos =
    (await Video.find().select("-owner").sort({ createdAt: -1 })) ||
    "no videos found";
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "All Videos fetched successfully"));
});
const getMyVideos = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const videos =
    (await Video.find({ uploadedBy: userId })
      .select("-owner")
      .sort({ createdAt: -1 })) || "no videos found";
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "My Videos fetched successfully"));
});
const getTrendingVideos = asyncHandler(async (req: Request, res: Response) => {
  const videos =
    (await Video.find().select("-owner").sort({ views: -1 }).limit(6)) ||
    "no videos found";
  if (videos.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No trending videos found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Trending Videos fetched successfully"));
});
export {
  UploadVideo,
  getVideos,
  getRandomVideos,
  getVideoBySearch,
  deleteVideo,
  getAllVideos,
  getMyVideos,
  getTrendingVideos,
};
