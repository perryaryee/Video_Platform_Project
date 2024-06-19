import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import UserRoutes from "./Routes/Users.js";
import VideoRoutes from "./Routes/Videos.js";
import AdminRoutes from "./Routes/Admin.js";




const app = express();

dotenv.config();

// mongoose.connect('mongodb://127.0.0.1:27017/videoplatform');
mongoose.connect(`mongodb+srv://perryaryeesci:${process.env.DBPASSWORD}@cluster1.lwgkhy4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


db.once('open', () => {
    console.log('Database connected successfully');
})



app.use(express.json());


app.use(cors({
    origin: ["http://localhost:3000","http://localhost:3000","https://asvavideoplatform.vercel.app/"],
    optionsSuccessStatus: 200,
}));


app.use("/api/auth", UserRoutes);
app.use("/api/video", VideoRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/Videos", express.static("./Videos"));


const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


