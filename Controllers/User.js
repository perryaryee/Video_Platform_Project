import express from "express";
import bcrypt from "bcrypt";
import User from "../Models/Users.js";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
import crypto from "crypto";



function generateVerificationCode() {
    const uuid = uuidv4();
    const verificationCode = uuid.substr(0, 6);
    return verificationCode;
}

const SignUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "All fiels are required.." });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationCode = generateVerificationCode();

        user = new User({ email, password: hashedPassword, verification_code: verificationCode });

        await user.save();



        await sendVerificationEmail(email, verificationCode);

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
}


async function sendVerificationEmail(email, verificationcode) {
    try {
        let transporter = nodemailer.createTransport({
            secure: false,
            port: 587,

            service: "gmail",
            auth: {
                user: "ignitelinesgh@gmail.com",
                pass: "rawumjggboumnqjp",
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        await transporter.sendMail({
            from: 'VideoM Video Plaform',
            to: email,
            subject: 'Email Verification Code',
            text: `Your verification code is: ${verificationcode}`,
        });
    } catch (error) {
        throw new Error('Failed to send verification email');
    }
}


const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            res.status(400).json({ message: "All fiels are required.." });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Invalid  credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(200).json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}


const Email_Confirm_Verification = async (req, res, next) => {
    try {
        const { email, verification_code } = req.body;

        const user = await User.findOne({ email, verification_code });

        if (!user) {
            return res.status(400).json({ message: 'Invalid verification code or email' });
        }

        User.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const Forgot_Password = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        await sendResetPasswordEmail(email, resetToken);

        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function sendResetPasswordEmail(email, resetToken) {
    try {
        let transporter = nodemailer.createTransport({
            secure: false,
            port: 587,

            service: "gmail",
            auth: {
                user: "ignitelinesgh@gmail.com",
                pass: "rawumjggboumnqjp",
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: 'VideoM Video Plaform',
            to: email,
            subject: 'Reset Password',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\nLink expires in an hour`,
        });
    } catch (error) {
        console.error('Failed to send reset password email:', error);
        throw new Error('Failed to send reset password email');
    }
}


const Reset_Password = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { SignUp, Login, Email_Confirm_Verification, Forgot_Password, Reset_Password }