import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'devudevzz3@gmail.com', 
    pass: 'mxsn rknm jojs hebw',
  },
});


function generateOTP (length = 6){
  const characters = '0123456789';
  let result = "";
  for(let i =0 ; i<length;i++){
    result +=characters.charAt(Math.floor(Math.random() * characters.length));

  }
  return result;
}


export const verifyOTP = async (req, res) => {
  const { username, otp } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp === otp) {
      // OTP is valid
      user.isVerified = true;
      user.otp = null; 

      await user.save();

      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const resendOTP = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP(); 
    user.otp = otp;
    await user.save();

    // Send new OTP to user's email
    const mailOptions = {
      from: 'devudevzz3@gmail.com',
      to: username,
      subject: 'New Verification Code',
      text: `Your new Circlify verification code is: ${otp}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to resend OTP. Please try again later.' });
      } else {
        console.log(`Email sent: ${info.response}`);
        return res.status(200).json({ message: 'OTP resent successfully' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// register
export const registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass;
  const newUser = new UserModel(req.body);
  const { username } = req.body;

  const otp = generateOTP();
  newUser.otp = otp;

  try {
    const oldUser = await UserModel.findOne({ username });

    if (oldUser) {
      return res
        .status(400)
        .json({ message: "username is already registered" });
    }
    const user = await newUser.save();
    const token = Jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );


// sending verification email....

const mailOptions = {
  from: 'devudevzz3@gmail.com', 
  to: username,
  subject: 'Verification Code',
  text: `Your Circlify verification code is: ${otp}`,
};
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Email sent: ${info.response}`);
  }
});

    res.status(200).json({ user, token,message:"User registered successfully" });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// login

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // find user with given username
  try {
    const user = await UserModel.findOne({ username: username });
    console.log(user)
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
     
      if(!validity){

        res.status(400).json("Wrong Password")
      }
      else if(user && user.blocked){
        res.status(403).json({message: "User is Blocked"})

      }else{
        const token = Jwt.sign({
          username:user.username, id: user._id,
        },process.env.JWT_KEY, {expiresIn:'1h'})
        res.status(200).json({user, token})
        }
    } else {
      res.status(404).json("User does not Exists");
    }
  } catch (error) {
   
    res.status(500).json({ message: error.message });
  }
};






const client = new OAuth2Client("364916588986-cq996ggekgh8niuj0odjt3v7fohjoeoe.apps.googleusercontent.com" );

export const googleSignIn = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience:"364916588986-cq996ggekgh8niuj0odjt3v7fohjoeoe.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    const { email } = payload;

   
    let user = await UserModel.findOne({ username: email });

    if (!user) {
      
      user = new UserModel({
        username: email,
       
      });
      await user.save();
    }
    // Respond with the token
    res.status(200).json({ user});
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    res.status(500).json({ message: "An error occurred during sign-in." });
  }
};
