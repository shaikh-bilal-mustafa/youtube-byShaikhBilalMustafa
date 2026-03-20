import { Types } from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";


export const updateVideoThumbnail = async (
  videoId: Types.ObjectId,
  filePath: string
) => {
  const thumbnail = await uploadOnCloudinary(filePath);

  return Video.findByIdAndUpdate(
    videoId,
    { thumbnailUrl: thumbnail?.url },
    { new: true }
  ).select("-__v");
};