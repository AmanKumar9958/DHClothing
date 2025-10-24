import express from 'express';
import { loginUser,registerUser,adminLogin, initSignup, verifySignup, getProfile, initPasswordReset, verifyResetOtp, resetPassword } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
// OTP signup
userRouter.post('/register-init', initSignup)
userRouter.post('/register-verify', verifySignup)
userRouter.get('/profile', authUser, getProfile)

// Password reset (forget password) flow with OTP
userRouter.post('/forgot-init', initPasswordReset)
userRouter.post('/forgot-verify', verifyResetOtp)
userRouter.post('/forgot-reset', resetPassword)

export default userRouter;