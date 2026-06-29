import mongoose from "mongoose";

export interface ILike extends mongoose.Document {
    video: mongoose.Types.ObjectId; // reference to Video model
    comment: mongoose.Types.ObjectId; // reference to Comment model
    likedBy: mongoose.Types.ObjectId; // reference to User model
    createdAt: Date;
    updatedAt: Date;
}
const likeSchema = new mongoose.Schema(
    {
        video: {    
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)
export const Like = mongoose.model<ILike>("Like", likeSchema);