import express from "express";
import bcrypt from "bcrypt";
import User from "../Models/Users.js";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";



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

        // Send email with verification code
        await transporter.sendMail({
            from: '"Your App" <yourapp@example.com>',
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
            return res.status(404).json({ message: 'User not found' });
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



export { SignUp, Login }