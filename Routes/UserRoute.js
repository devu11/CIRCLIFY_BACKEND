import express from "express";
import { deleteuser, followUser, getAllUser,  getFollowedUsers,  getUser, getUserProfile, unfollowUser, updateUser, updateUserPrivacy } from "../Controllers/UserController.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";
const router = express.Router();


router.get('/',getAllUser)
router.get('/:id',getUser)
router.put('/:id', authMiddleware,updateUser)
router.delete('/:id',authMiddleware,deleteuser)
router.put('/:id/follow',authMiddleware,followUser)
router.put('/:id/unfollow', authMiddleware,unfollowUser) 
router.get('/:userId/followedUsers', getFollowedUsers); 
router.get('/:userId/profile', getUserProfile)
router.put('/:id/privacy', authMiddleware, updateUserPrivacy);
export default router;
