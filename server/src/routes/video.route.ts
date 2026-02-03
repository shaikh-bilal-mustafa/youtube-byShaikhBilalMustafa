import { Router } from "express";
import{UploadVideo,getRandomVideos,deleteVideo, getVideoBySearch} from "../controllers/video.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();
router.route("/").get(getRandomVideos);
router.route("/search").get(getVideoBySearch);
//secure routes with verifyJWT middleware
router.route("/upload").post(
    verifyJWT,
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },{
           name:"thumbnailUrl",
           maxCount:1
        },
    ]),
    UploadVideo
);

router.delete("/:videoId", verifyJWT, deleteVideo);
export default router;