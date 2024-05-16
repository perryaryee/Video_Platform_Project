import express from "express";
import { upload, Upload_Video } from "../Controllers/Video.js"

const Router = express.Router();

Router.post("/upload_video", upload.single("video"), Upload_Video );


export default Router;