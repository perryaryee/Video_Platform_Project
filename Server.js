import express from "express";
import dotenv from "dotenv";
import cors from "cors";



const app = express();

dotenv.config();

app.use(express.json());


app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    optionsSuccessStatus: 200,
}));


const PORT = 8000;


app.listen(PORT, () => {
    console.log("Currently running on port 6000");
});
