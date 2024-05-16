import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import UserRoutes from "./Routes/Users.js";




const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/videoplatform');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


db.once('open', () => {
    console.log('Database connected successfully');
})

dotenv.config();

app.use(express.json());


app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    optionsSuccessStatus: 200,
}));


app.use("/api/auth", UserRoutes);



const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


