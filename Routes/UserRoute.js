import express from "express";
import { deleteuser, followUser, getAllUser,  getFollowedUsers,  getUser, unfollowUser, updateUser } from "../Controllers/UserController.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";
const router = express.Router();


router.get('/',getAllUser)
router.get('/:id',getUser)
router.put('/:id', authMiddleware,updateUser)
router.delete('/:id',authMiddleware,deleteuser)
router.put('/:id/follow',authMiddleware,followUser)
router.put('/:id/unfollow', authMiddleware,unfollowUser) 
router.get('/:userId/followedUsers', getFollowedUsers); 


export default router;
