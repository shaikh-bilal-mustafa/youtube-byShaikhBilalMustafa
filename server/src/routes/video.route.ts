import { Router } from "express";
import {
  UploadVideo,
  getRandomVideos,
  deleteVideo,
  getVideoBySearch,
  getAllVideos,
  getMyVideos,
  getTrendingVideos,
  getVideoById,
  updateVideo,
  getAllVideosPaginated,
} from "../controllers/video.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();
router.route("/").get(getRandomVideos);
router.route("/search").get(getVideoBySearch);
router.route("/all").get(getAllVideosPaginated);
router.route("/trending").get(getTrendingVideos);
//secure routes with verifyJWT middleware
router.route("/upload").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnailUrl",
      maxCount: 1,
    },
  ]),
  UploadVideo,
);
router.route("/my").get(verifyJWT, getMyVideos);
router.route("/:videoId").get(getVideoById).put(verifyJWT, updateVideo);
router.delete("/:videoId", verifyJWT, deleteVideo);
export default router;
