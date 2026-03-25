import { Router } from "express";
import { addComment, getVideoComments } from "../controllers/comment.controller.js";
const router = Router();

router.route("/comments").post(addComment);
router.route("/:videoId/comments").get(getVideoComments);


export default router;
