import multer, { FileFilterCallback } from "multer";
import path from "path";
import {NextFunction, Request,Response} from "express";
import SessionModel from "../Model/sessionModel";
import CategoryModel from "../Model/categoryModel";
import UserModel from "../Model/userModel";


const storage = (filePath: string,) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `public/${filePath}`);
        },
        filename: function (req, file, cb) {
            let naming='';
            let type='';
            if(req.session_files)
            {
                naming=req.session_files;
                type='session';
            }
            if(req.background)
            {
                naming=req.background;
                type='category';
            }

            if(req.profile){
                naming=req.profile;
                type='profile';
            }

            req.uploadedData=naming;
            req.type=type;
            if(req.uploadedData!=='fallbackimage.jpg')
                req.naming=file.fieldname + '-' +naming + path.extname(file.originalname).toLowerCase();
            else if(req.uploadedData=='fallbackimage.jpg')
                req.naming=req.uploadedData;
            cb(null, req.naming);
        },
    });
};


const fileFilter = (filePath: string) => {
    return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const imageTypes = /\.(jpg|jpeg|png|gif)$/;
        const docTypes = /\.(pdf|doc|docx)$/;


        if (filePath === 'category_backgrounds' || filePath === 'profile_pictures') {
            if (!file.originalname.match(imageTypes)) {
                return cb(new Error('Only image files are allowed.'));
            }
        } else if (filePath === 'session_files') {
            if (!file.originalname.match(docTypes)) {
                return cb(new Error('Only PDF and DOC/DOCX files are allowed.'));
            }
        } else {
            return cb(new Error('Invalid upload path.'));
        }

        cb(null, true);
    };
};

const upload = (filePath: string) => {
    return multer({
        storage: storage(filePath),
        limits: { fileSize: 10000000 }, // 10MB
        fileFilter: fileFilter(filePath),
    });
};

const updateModelWithFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.file || !req.uploadedData) {
        return next();
    }

    try {
        let updatedField = {};
        let model;

        if (req.type === "session") {
            model = SessionModel;
            updatedField = { filePath: `public/session_files/${req.naming}` };
        } else if (req.type === "category") {
            model = CategoryModel;
            updatedField = { backgroundImage: `public/category_backgrounds/${req.naming}` };
        } else if (req.type === "profile") {
            model = UserModel;
            updatedField = { profilePicture: `public/profile_pictures/${req.naming}` };
        }

        if (!model) {
            res.status(400).json({ error: "Invalid file type." });
            return; // Fontos: Ne hívj next(), ha már válaszoltál!
        }

        const doc = await model.findByIdAndUpdate(req.uploadedData, updatedField, { new: true });

        if (!doc) {
            res.status(404).json({ error: "Record not found." });
            return;
        }

        return next(); // Csak akkor hívódik meg, ha minden sikeres
    } catch (error) {
        console.error("Error updating model:", error);
        res.status(500).json({ error: "Database update failed.", details: (error as Error).message });
    }
};


export { storage, upload ,updateModelWithFile};
