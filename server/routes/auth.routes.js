import express from 'express';
import multer from 'multer';
import path from 'path';
import { signupUser, loginUser } from '../controllers/auth.controller.js';

const router = express.Router();

// Multer setup for vendor images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/vendors/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/signup', upload.single('image'), signupUser);
router.post('/login', loginUser);

export default router;
