import mongoose from "mongoose";

export interface ISubscription extends mongoose.Document {
    subscriber: mongoose.Types.ObjectId; // reference to User model
    channel: mongoose.Types.ObjectId; // reference to User model
    createdAt: Date;
    updatedAt: Date;    
}
const subscriptionSchema = new mongoose.Schema(
    {
        subscriber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)
export const Subscription = mongoose.model<ISubscription>("Subscription", subscriptionSchema);