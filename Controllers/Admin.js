
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../Models/Admin.js";
import { blacklistedTokens } from "../Middlewares/VerfifyToken.js";


const CreateAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: 'All fieds are required!' });
        }

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await Admin.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'Admin created successfully', admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const AdminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '4h' });
        res.status(200).json({ token, admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const AdminLogout = (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        blacklistedTokens.add(token);
    }

    res.status(200).json({ message: 'Logout successful' });
};


export { CreateAdmin, AdminLogin }