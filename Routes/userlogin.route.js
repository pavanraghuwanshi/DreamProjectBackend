import express from 'express';
import { loginUser, registerUser } from '../Controllers/User.Controller.js';

const router = express.Router();


router.post("/register/user",registerUser);
router.post("/auth/login",loginUser);



export default router;