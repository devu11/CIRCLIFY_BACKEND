 import PostModel from "../models/postModel.js";
 import mongoose from "mongoose";
import UserModel from "../models/userModel.js";



//  For creating new posts

export const createPost = async(req,res)=>{
    const newPost = new PostModel(req.body);
    try {
        await newPost.save();
        res.status(200).json(newPost)
    } catch (error) {
        res.status(500).json(error)
    }
}

// For Getting a Post 

export const getPost = async (req,res)=>{
  console.log("................")
    const id = req.params.id;
    try{
        const post = await PostModel.findById(id);
        console.log("backend post",post)
        res.status(200).json(post);

    }catch(error){
        res.status(500).json(error)
    }
}

// update post
export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const { userId,...updatedFields } = req.body;
  
    try {
      const post = await PostModel.findById(postId);
      if (post.userId === userId) {
        await post.updateOne({ $set: updatedFields});
        res.status(200).json("Post updated!");
      } else {
        res.status(403).json("Authentication failed");
      }
    } catch (error) {}
  };
  

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  
  try {
    const post = await PostModel.findById(postId);
    console.log(post)
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (String(post.userId) !== userId) {
      return res.status(403).json({ message: "Authentication failed" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};













  
  // like/dislike a post
  export const likePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;
    try {
      const post = await PostModel.findById(id);
      if (post.likes.includes(userId)) {
        await post.updateOne({ $pull: { likes: userId } });
        res.status(200).json("Post disliked");
      } else {
        await post.updateOne({ $push: { likes: userId } });
        await post.save();
        res.status(200).json("Post liked");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };


  // add a comment 
  export const addComment = async (req, res) => {
    const { id } = req.params; // Post ID
    const { userId, comment } = req.body;
  
    try {
      const post = await PostModel.findById(id);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      post.comments.push({ userId, comment });
      await post.save();
  
      res.status(201).json({ message: "Comment added successfully", post });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
    

  


  


  // Get timeline posts
  export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id
    try {
      const currentUserPosts = await PostModel.find({ userId: userId });
  
      const followingPosts = await UserModel.aggregate([
        { 
          $match: {
            _id: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "following",
            foreignField: "userId",
            as: "followingPosts",
          },
        },
        {
          $project: {
            followingPosts: 1,
            _id: 0,
          },
        },
      ]);
  
      res.status(200).json(
        currentUserPosts
          .concat(...followingPosts[0].followingPosts)
          .sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
      );
    } catch (error) {
      res.status(500).json(error);
    }
  };