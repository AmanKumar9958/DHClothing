import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import pendingUserModel from "../models/pendingUserModel.js";
import { sendOtpMail } from "../config/mailer.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Name, email and password are required" });
        }

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" });
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
// exports consolidated below
// Init signup with OTP: stores pending user and emails OTP
export const initSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password)
            return res.json({ success: false, message: "Missing fields" });

        const exists = await userModel.findOne({ email });
        if (exists)
            return res.json({ success: false, message: "User already exists" });

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // generate otp
        const otp = (Math.floor(100000 + Math.random() * 900000)).toString(); // 6-digit
        const otpHash = await bcrypt.hash(otp, 10);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // upsert pending user (replace if exists)
        await pendingUserModel.findOneAndUpdate(
            { email },
            { name, email, password: hashedPassword, otpHash, otpExpiresAt: expires, attempts: 0 },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        await sendOtpMail(email, otp);

        return res.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Verify OTP and finalize registration
export const verifySignup = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp)
            return res.json({ success: false, message: "Missing email or OTP" });

        const pending = await pendingUserModel.findOne({ email });
        if (!pending)
            return res.json({ success: false, message: "No pending signup found" });

        if (pending.otpExpiresAt < new Date()) {
            await pendingUserModel.deleteOne({ _id: pending._id });
            return res.json({ success: false, message: "OTP expired. Please start again." });
        }

        const match = await bcrypt.compare(otp.toString(), pending.otpHash);
        if (!match) {
            const attempts = (pending.attempts || 0) + 1;
            // Optionally lock after 5 attempts
            if (attempts >= 5) {
                await pendingUserModel.deleteOne({ _id: pending._id });
                return res.json({ success: false, message: "Too many attempts. Please restart signup." });
            }
            await pendingUserModel.updateOne({ _id: pending._id }, { attempts });
            return res.json({ success: false, message: "Invalid OTP" });
        }

        // Create user
        const created = await userModel.create({
            name: pending.name,
            email: pending.email,
            password: pending.password,
        });
        await pendingUserModel.deleteOne({ _id: pending._id });

        // Do NOT log user in; redirect to login on frontend
        return res.json({ success: true, message: "Email verified. You can login now." });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        if (!userId) {
            return res.json({ success: false, message: "Not Authorized" });
        }

        const user = await userModel.findById(userId).lean();
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData = user.cartData || {};
        const cartCount = Object.values(cartData).reduce((total, sizes) => {
            if (!sizes) return total;
            return total + Object.values(sizes).reduce((sum, qty) => sum + (qty || 0), 0);
        }, 0);

        const profile = {
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            cartCount,
            cartData,
        };

        res.json({ success: true, user: profile });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin };