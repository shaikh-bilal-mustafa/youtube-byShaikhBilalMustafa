import { toggleSubscription, getSubscriptionCount, getSubscriptionStatus, getSubscriptionVideos } from "../controllers/subscription.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/toggle/:channelId").post(verifyJWT, toggleSubscription);
router.route("/count/:channelId").get(getSubscriptionCount);
router.route("/status/:channelId").get(verifyJWT, getSubscriptionStatus);
router.route("/videos").get(verifyJWT, getSubscriptionVideos);
export default router;