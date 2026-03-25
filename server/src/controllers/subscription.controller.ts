import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const toggleSubscription = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
    if(!userId) {
    throw new ApiError(401, "Login required");
    }
    const { channelId } = req.params;
    if(!channelId) {
    throw new ApiError(400, "Channel ID is required");
    }
    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId,
    });
    if(existingSubscription) {
        await Subscription.deleteOne({ _id: existingSubscription._id });
        return res.json(new ApiResponse(200, "Unsubscribed from channel"));
    }
    await Subscription.create({
        subscriber: userId,
        channel: channelId,
    });
    res.json(new ApiResponse(200, "Subscribed to channel"));
}
);
const getSubscriptionCount = asyncHandler(async (req: Request, res: Response) => {
    const { channelId } = req.params;
    if(!channelId) {
    throw new ApiError(400, "Channel ID is required");
    }
    const count = await Subscription.countDocuments({ channel: channelId });
    res.json(new ApiResponse(200, { count }, "Subscription count fetched"));
});
const getSubscriptionStatus = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { channelId } = req.params;
    if(!channelId) {
    throw new ApiError(400, "Channel ID is required");
    }
    const subscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId,
    });
    res.json(new ApiResponse(200, { isSubscribed: !!subscription }, "Subscription status fetched"));
});
export { toggleSubscription, getSubscriptionCount, getSubscriptionStatus };