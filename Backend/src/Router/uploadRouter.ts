import express, {NextFunction,Request,Response} from "express";
import { upload } from "../Utils/multerConfig";
import {getUserFromJWT} from "../Controller/authController";
import {Model} from "mongoose";

const router = express.Router();


router.post('/:file_path/:id?',getUserFromJWT, (req:Request, res:Response, next:NextFunction) => {

    const { file_path,id } = req.params;

    if(file_path==='profile_pictures'){
        req.profile=req.user.id;
    }
    if(file_path==='category_backgrounds')
    {
        req.background=id;
    }
    if(file_path==='session_files'){
        req.session_files=id;
    }

    const uploadMiddleware = upload(file_path).single('file');

    uploadMiddleware(req, res, (err) => {
        if (err) {

            return res.status(400).json({ error: err.message });
        }

        res.json({ message: 'File uploaded successfully!', file: req.file });
    });
});

export default router;
