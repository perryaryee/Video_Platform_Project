import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import UserRoutes from "./Routes/Users.js";



const app = express();

mongoose.connect('mongodb://localhost:27017/your-database-name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

dotenv.config();

app.use(express.json());


app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    optionsSuccessStatus: 200,
}));


app.use("/api/auth", UserRoutes);


const PORT = 8000;


app.listen(PORT, () => {
    console.log("Currently running on port 6000");
});
