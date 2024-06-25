import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import UserRoutes from "./Routes/Users.js";
import VideoRoutes from "./Routes/Videos.js";
import AdminRoutes from "./Routes/Admin.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";


const app = express();

dotenv.config();

mongoose.connect(`mongodb+srv://perryaryeesci:${process.env.DBPASSWORD}@cluster1.lwgkhy4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`);
// mongoose.connect("mongodb://127.0.01:27017/videoplatform");

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('Database connected successfully');
});

app.use(express.json());

app.use(cors({
    origin: ["https://asvavideoplatform.vercel.app"],
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));


app.options("*", cors({
    origin: ["https://asvavideoplatform.vercel.app"],
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use("/api/auth", UserRoutes);
app.use("/api/video", VideoRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/Videos", express.static("./Videos"));


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Video Platform API docs"
        },
        servers: [
            {
                url: "https://video-platform-project-backend.onrender.com"
            }
        ]
    },
    apis: ["./Models/*.js","./Routes/.js",],
}

const spacs = swaggerJSDoc(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(spacs))

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
