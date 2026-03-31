import { Router } from "express";
import { addComment, getVideoComments, deleteComment, updateComment, getVideoCommentsPaginated } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/:videoId/comments").get(getVideoCommentsPaginated).post(verifyJWT, addComment);
router.route("/:commentId").delete(verifyJWT, deleteComment).put(verifyJWT, updateComment);


export default router;
