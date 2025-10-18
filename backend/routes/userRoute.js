import express from 'express';
import { loginUser,registerUser,adminLogin, initSignup, verifySignup } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
// OTP signup
userRouter.post('/register-init', initSignup)
userRouter.post('/register-verify', verifySignup)

export default userRouter;