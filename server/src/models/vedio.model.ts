import { Schema, model, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IVedio extends Document {
  videoFile: string; // cloudinary url
  thumbnailUrl: string; // cloudinary url
  title: string;
  description?: string;
  duration: number; // in seconds
  views: number;
  isPublished: boolean;
  likes: number;
  dislikes: number;
  commentsCount: number;
  uploadedBy: Schema.Types.ObjectId; // reference to User model
  // tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
const vedioSchema = new Schema({
  videoFile: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  duration: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });
vedioSchema.plugin(mongooseAggregatePaginate);
export const Vedio = model<IVedio>("Vedio", vedioSchema);