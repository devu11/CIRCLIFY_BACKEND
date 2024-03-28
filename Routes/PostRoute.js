import express from "express";
import { addComment, createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost } from "../Controllers/PostControllers.js";
const router = express.Router()

router.post("/",createPost);
router.get("/:id",getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.put('/:id/like', likePost);
router.post('/:id/comment',addComment)

router.get('/:id/timeline', getTimelinePosts);

export default router;
