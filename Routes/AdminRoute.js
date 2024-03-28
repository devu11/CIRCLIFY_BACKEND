import express from "express";

import { adminLogin, blockUser, getAllUsers, unblockUser } from "../Controllers/AdminController.js";

const router = express.Router();

router.post("/adminLogin",adminLogin);
router.get("/getUser" , getAllUsers)
router.patch("/block/:id", blockUser)
router.patch("/unblock/:id",unblockUser)

export default router;