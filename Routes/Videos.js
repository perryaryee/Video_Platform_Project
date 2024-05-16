import express from "express";
import { upload, Upload_Video, FetchVideos } from "../Controllers/Video.js"

const Router = express.Router();

Router.post("/upload_video", upload.single("video"), Upload_Video);
Router.get("/all_video", FetchVideos);


export default Router;