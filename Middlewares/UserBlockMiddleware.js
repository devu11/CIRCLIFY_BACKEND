import UserModel from "../models/userModel.js"

const checkUserStatus = async (req, res, next) => {
   try {
      const userId = req.params.id || req.body.userId;
      const user = await UserModel.findById(userId);
      if (user && user.blocked) {
        return res.status(403).json({ message: "User is blocked. You are not allowed to access this resource." });
      }
      next();
   } catch (error) {
      res.status(500).json({ message: "An error occurred while checking user status." });
   }
  };
 
 export default checkUserStatus;
 