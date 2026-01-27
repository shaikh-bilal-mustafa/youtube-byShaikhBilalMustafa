import mongoose from "mongoose";

export interface IPlaylist extends mongoose.Document {
    name: string;
    description: string;
    videos: mongoose.Types.ObjectId[]; // array of references to Video model
    owner: mongoose.Types.ObjectId; // reference to User model
    createdAt: Date;
    updatedAt: Date;
}   
const playlistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        videos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)
export const Playlist = mongoose.model<IPlaylist>("Playlist", playlistSchema);