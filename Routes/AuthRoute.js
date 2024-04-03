import express from "express";
import { googleSignIn, initiateForgotPassword, loginUser, registerUser, resendOTP, resetPassword, verifyOTP} from "../Controllers/AuthController.js";

const router = express.Router();

router.post('/register',registerUser)
router.post('/verifyOTP', verifyOTP);
router.post('/resendOTP', resendOTP);
router.post('/login', loginUser);
router.post('/googleSignIn',googleSignIn)
router.post('/initiateForgotPassword',initiateForgotPassword)
router.post('/resetPassword', resetPassword)
export default router;

 