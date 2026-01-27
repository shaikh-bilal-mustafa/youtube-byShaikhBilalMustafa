import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IComment extends mongoose.Document {
    content: string;
    video: mongoose.Types.ObjectId; // reference to Video model
    owner: mongoose.Types.ObjectId; // reference to User model
    createdAt: Date;
    updatedAt: Date;
}
const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)


commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema)