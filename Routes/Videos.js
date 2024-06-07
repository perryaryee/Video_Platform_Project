import express from "express";
import { upload, Upload_Video, FetchVideos, Fetch_video_withoutPagination,Update_video, Delete_Video } from "../Controllers/Video.js";
import auth_security from "../Middlewares/VerfifyToken.js";

const Router = express.Router();

Router.post("/upload_video", upload.single("videopath"), Upload_Video);
Router.get("/all_video", FetchVideos, auth_security,);
Router.get("/all", Fetch_video_withoutPagination);
Router.delete("/:id",Delete_Video);
Router.put("/:id",Update_video)
// Router.get("/all_video", FetchVideos);


export default Router;