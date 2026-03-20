import  { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
// routes/like.routes.ts

import { toggleLike, getLikeCount, getLikeStatus } from "../controllers/like.controller.js";
const router = Router();
router.route("/toggle").post(verifyJWT, toggleLike);
router.route("/count/:videoId").get(getLikeCount);
router.route("/status/:videoId").get(verifyJWT, getLikeStatus);

export default router;

