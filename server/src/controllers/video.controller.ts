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
const cleanupTempFile = (files: any) => {
  Object.values(files || {})
    .flat()
    .forEach((file: any) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Temp file cleanup failed:", err);
      });
    });
};

const UploadVideo = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const cleanupFiles = (files: any) => {
      Object.values(files || {})
        .flat()
        .forEach((file: any) => {
          fs.unlink(file.path, (err) => {
            if (err) console.error("Cleanup failed:", err);
          });
        });
    };
    if (!req.user?._id) {
      cleanupFiles(req.files);
      throw new ApiError(401, "Unauthorized");
    }

    try {
      const { title, visibility } = req.body;

      // 🔴 Validate fields
      if (!title || !visibility) {
        cleanupFiles(req.files);
        throw new ApiError(400, "Missing required field title or visibility");
      }

      // 🔴 Validate files
      if (!req.files || typeof req.files !== "object") {
        throw new ApiError(400, "Files not uploaded properly");
      }
      const files = req.files as Record<string, Express.Multer.File[]>;

      if (!files.videoFile || files.videoFile.length === 0) {
        cleanupFiles(req.files);
        throw new ApiError(400, "Video file is required");
      }

      // 🟡 Paths
      const videoLocalPath = path.resolve(files.videoFile[0].path);

      let thumbnailLocalPath: string;
      if (!files.thumbnailUrl || files.thumbnailUrl.length === 0) {
        thumbnailLocalPath = await generateThumbnail(videoLocalPath);
      } else {
        thumbnailLocalPath = files.thumbnailUrl[0].path;
      }

      // 🔵 Get duration
      let duration: number;
      try {
        duration = await getVideoDuration(videoLocalPath);
      } catch (error) {
        cleanupFiles(req.files);
        throw new ApiError(500, "Failed to get video duration");
      }

      // 🟢 Upload video
      const videoUpload = await uploadOnCloudinary(videoLocalPath);
      if (!videoUpload?.url) {
        cleanupFiles(req.files);
        throw new ApiError(500, "Video upload failed");
      }

      // 🟣 Upload thumbnail
      let thumbnailUpload;
      if (thumbnailLocalPath) {
        thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnailUpload?.url) {
          cleanupFiles(req.files);
          throw new ApiError(500, "Thumbnail upload failed");
        }
      }

      // ⚫ Save to DB
      const videoData = await Video.create({
        videoFile: videoUpload.url,
        thumbnailUrl: thumbnailUpload?.url || "",
        title,
        duration: duration || 0,
        views: 0,
        visibility: visibility as "public" | "private" | "unlisted",
        user: req.user._id,
        category :"Education"
      });

      const createdVideo = await Video.findById(videoData._id).select("-owner");

      if (!createdVideo) {
        cleanupFiles(req.files);
        throw new ApiError(500, "Video creation failed");
      }

      // 🧹 Cleanup temp files after success
      cleanupFiles(req.files);
      return res
        .status(201)
        .json(
          new ApiResponse(201, createdVideo, "Video uploaded successfully"),
        );
    } catch (error) {
      // 🧹 Cleanup on any failure
      cleanupFiles(req.files);
      throw error;
    }
  },
);
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
      { $match: { visibility: "public" } },
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
  if (video.user.toString() !== userId.toString()) {
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
    (await Video.find({ user: userId })
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
const getVideoById = asyncHandler(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId).populate("user", "username fullName avatar");
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  // Increment view count
  video.views += 1;
  await video.save();
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});
const updateVideo = asyncHandler(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const { title, description, visibility } = req.body;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to update this video");
  }
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $set: { title, description, visibility } },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});
const getAllVideosPaginated = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const videos = await Video.find()
    .select("-owner")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const totalVideos = await Video.countDocuments();
  const totalPages = Math.ceil(totalVideos / limit);
  return res
    .status(200)
    .json(new ApiResponse(200, { videos, totalPages, currentPage: page }, "Videos fetched successfully"));
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
  getVideoById,
  updateVideo,
  getAllVideosPaginated,
};
