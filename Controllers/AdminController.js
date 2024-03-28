import UserModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import  Jwt  from "jsonwebtoken";


export const createAdminAccount = async () => {
  try {
    const existingAdmin = await UserModel.findOne({ username: 'admin@gmail.com' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const admin = new UserModel({
        username: 'admin@gmail.com',
        password: hashedPassword,
        isAdmin: true,
      });

      await admin.save();
      console.log('Admin account created successfully.');
    } else {
      console.log('Admin account already exists.');
    }
  } catch (error) {
    console.error('Error creating admin account:', error.message);
  }
};


export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (username !== 'admin@gmail.com') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const admin = await UserModel.findOne({ username: 'admin@gmail.com' });

    if (admin) {
      const validity = await bcrypt.compare(password, admin.password);

      if (!validity) {
        res.status(400).json({ message: 'Wrong Password' });
      } else {
        const token = Jwt.sign(
          {
            username: admin.username,
            id: admin._id,
          },
          process.env.JWT_KEY,
          { expiresIn: '1h' }
        );
        res.status(200).json({ user: admin, token });
      }
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getAllUsers = async (req,res)=>{
  try{
    let users = await UserModel.find();
    users = users.map((user)=>{
      const {password,...otherDetails} = user._doc
      return otherDetails
    })
    res.status(200).json(users)
  }catch(error){
res.status(500).json(error)
  }
}


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


// Block User
export const blockUser = async (req,res)=>{
  const userId = req.params.id;
  try{
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {blocked:true},
      {new : true}
    );
    res.status(200).json({message: "User Blocked Successfully",user})
  }catch(error){
    res.status(500).json({message:"Error blocking user", error})

  }
}

// Unblock User 

export const unblockUser = async (req,res)=>{
  const userId = req.params.id;

  try{
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {blocked : false},
      {new : true}

    );
    res.status(200).json({message: "User unblock successfully", user});

  }catch(error){
    res.status(500).json({message: " Error unblocking user", error})
  }
}