import mongoose from "mongoose";

export interface ITweet extends mongoose.Document {
    content: string;
    owner: mongoose.Types.ObjectId; // reference to User model
    createdAt: Date;
    updatedAt: Date;
}
const tweetSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)
export const Tweet = mongoose.model<ITweet>("Tweet", tweetSchema);