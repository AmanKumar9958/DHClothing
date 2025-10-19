import express from 'express';
import { loginUser,registerUser,adminLogin, initSignup, verifySignup, getProfile } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
// OTP signup
userRouter.post('/register-init', initSignup)
userRouter.post('/register-verify', verifySignup)
userRouter.get('/profile', authUser, getProfile)

export default userRouter;