import express from "express";
import { upload, Upload_Video, FetchVideos, Fetch_video_withoutPagination, Update_video, Delete_Video } from "../Controllers/Video.js";
import { auth_security } from "../Middlewares/VerfifyToken.js";

const Router = express.Router();

Router.post("/upload_video", auth_security, upload.single("videopath"), Upload_Video);
Router.get("/all_video", auth_security, FetchVideos);
Router.get("/all", auth_security, Fetch_video_withoutPagination);
Router.delete("/:id", auth_security, Delete_Video);
Router.put("/:id", auth_security, Update_video);


export default Router;