import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { toggleLike, getLikeCount, getLikeStatus } from "../controllers/like.controller.js";
const router = Router();
router.route("/toggle/:videoId").post(verifyJWT, toggleLike);
router.route("/count/:videoId").get(getLikeCount);
router.route("/status/:videoId").get(verifyJWT, getLikeStatus);

export default router;

