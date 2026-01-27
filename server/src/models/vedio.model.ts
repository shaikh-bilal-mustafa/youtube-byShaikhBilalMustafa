import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IVedio extends mongoose.Document {
  videoFile: string; // cloudinary url
  thumbnailUrl: string; // cloudinary url
  title: string;
  duration: number; // in seconds
  views: number;
  isPublished: boolean;
  description: string;
  owner : mongoose.Types.ObjectId; // reference to User model
    // likes: number;
    // dislikes: number;
    // commentsCount: number;
    // uploadedBy: mongoose.Types.ObjectId; // reference to User model
    // tags: string[];
    // createdAt: Date;
    // updatedAt: Date;
}
const vedioSchema = new mongoose.Schema({
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
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
}, { timestamps: true });
vedioSchema.plugin(mongooseAggregatePaginate);
export const Vedio = mongoose.model<IVedio>("Vedio", vedioSchema);