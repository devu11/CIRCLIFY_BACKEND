import express from "express";
const router = express.Router();
import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "public/images");
    },
    filename: (req,file,cb)=>{
        cb(null,req.body.name);
    },
});

const upload = multer ({storage:storage});

router.post('/',upload.array("file"), (req,res)=>{
    try {
        return res.status(200).json("File Uploaded Successfully")
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
})

export default router;