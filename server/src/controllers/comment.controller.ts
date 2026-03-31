import { Request, Response } from 'express';
import { Comment } from '../models/comment.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const addComment = asyncHandler(async (req: Request, res: Response) => {
    if(!req.user || !req.user._id) {
        throw new ApiError(401, 'Login required');
    }
    const { videoId, content } = req.body;
    
    if (!videoId || !content) {
        throw new ApiError(400, 'Video ID and content are required');
    }   
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
    }); 
    res.json(new ApiResponse(201, comment, 'Comment added successfully'));
});

const getVideoComments = asyncHandler(async (req: Request, res: Response) => {  
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(400, 'Video ID is required');
    }
    const comments = await Comment.find({ video: videoId })
        .populate('owner', 'username avatarUrl')
        .sort({ createdAt: -1 });
    res.json(new ApiResponse(200, comments, 'Comments fetched successfully'));
});
const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    if(!req.user || !req.user._id) {
        throw new ApiError(401, 'Login required');
    }
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(400, 'Comment ID is required');
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You can only delete your own comments');
    }
    await comment.remove();
    res.json(new ApiResponse(200, null, 'Comment deleted successfully'));
});
const updateComment = asyncHandler(async (req: Request, res: Response) => {
    if(!req.user || !req.user._id) {
        throw new ApiError(401, 'Login required');
    }
    const { commentId } = req.params;
    const { content } = req.body;
    if (!commentId || !content) {
        throw new ApiError(400, 'Comment ID and content are required');
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You can only update your own comments');
    }
    comment.content = content;
    await comment.save();
    res.json(new ApiResponse(200, comment, 'Comment updated successfully'));
});
const getVideoCommentsPaginated = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    if (!videoId) {
        throw new ApiError(400, 'Video ID is required');
    }
    const comments = await Comment.find({ video: videoId })
        .populate('owner', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const totalComments = await Comment.countDocuments({ video: videoId });
    const totalPages = Math.ceil(totalComments / limit);
    res.json(new ApiResponse(200, { comments, totalPages, currentPage: page }, 'Comments fetched successfully'));
});


export { addComment, getVideoComments, deleteComment, updateComment, getVideoCommentsPaginated };