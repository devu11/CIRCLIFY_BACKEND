import Jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import NotificationModel from "../models/notificationModel.js";

// getAllUsers

export const getAllUser = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    let users = await UserModel.find();
    if (searchQuery) {
      users = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get a User
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such user Exists");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a User
export const updateUser = async (req, res) => {
  const id = req.params.id;

  const { _id, currentUserAdminStatus, password } = req.body;

  if (id === _id) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const token = Jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! You can only update your profile");
  }
};

export const deleteuser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId, currentUserAdminStatus } = req.body;

  if (currentUserId === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User Deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied!! you can only delete your profile");
  }
};

//follow user

export const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (_id == id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);
      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        await NotificationModel.create({
          userId: id,
          type: "follow",
          content: `${followingUser.username} started following you.`,
        });

        res.status(200).json("User followed!");
      } else {
        res.status(403).json("You are already following this user");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (_id == id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const unfollowUser = await UserModel.findById(id);
      const unfollowingUser = await UserModel.findById(_id);
      if (unfollowUser.followers.includes(_id)) {
        await unfollowUser.updateOne({ $pull: { followers: _id } });
        await unfollowingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("User unfollowed!");
      } else {
        res.status(403).json("You are not following this user");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

export const getFollowedUsers = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await UserModel.findById(userId);
    if (user) {
      const followedUsers = await UserModel.find({
        _id: { $in: user.following },
      });
      res.status(200).json(followedUsers);
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.params.userId;
  const currentUserId = req.userId;
  try {
    const user = await UserModel.findById(userId);
    if (user) {
      if (user.isPrivate) {
        if (user.followers.includes(currentUserId) || user.following.includes(currentUserId)) {
          res.status(200).json(user);
        } else {
          res.status(403).json("This user's profile is private.");
        }
      } else {
        res.status(200).json(user);
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};


export const updateUserPrivacy = async (req, res) => {
  const { id } = req.params;
  const { isPrivate } = req.body;
 
  try {
     const user = await UserModel.findByIdAndUpdate(id, { isPrivate }, { new: true });
     if (user) {
       res.status(200).json(user);
     } else {
       res.status(404).json({ message: "User not found" });
     }
  } catch (error) {
     res.status(500).json({ message: "Server error" });
  }
 };