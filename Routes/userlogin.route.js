import express from 'express';
import { addAdmin, loginUser, storeFcmToken } from '../Controllers/User.Controller.js';
import authenticateUser from '../Middleware/authMiddleware.js';

const router = express.Router();


router.post("/login",loginUser);
router.post("/superadmin",addAdmin);
router.post("/fcmtoken/store",authenticateUser,storeFcmToken);

export default router;