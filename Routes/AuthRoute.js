import express from "express";
import { googleSignIn, loginUser, registerUser, resendOTP, verifyOTP} from "../Controllers/AuthController.js";

const router = express.Router();

router.post('/register',registerUser)
router.post('/verifyOTP', verifyOTP);
router.post('/resendOTP', resendOTP);
router.post('/login', loginUser)
router.post('/googleSignIn',googleSignIn)

export default router;

 