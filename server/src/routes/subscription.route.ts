import { toggleSubscription } from "../controllers/subscription.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getSubscriptionCount, getSubscriptionStatus } from "../controllers/subscription.controller.js";    
const router = Router();

router.route("/toggle").post(verifyJWT, toggleSubscription);
router.route("/count/:channelId").get(getSubscriptionCount);
router.route("/status/:channelId").get(verifyJWT, getSubscriptionStatus);   
export default router;