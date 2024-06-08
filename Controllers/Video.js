import multer from "multer";
import Video from "../Models/Videos.js";
import path from "path";



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Videos");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });


const Upload_Video = async (req, res, next) => {

    try {
        const { title, description } = req.body;
        const videoPath = req.file.path;

        if (!title || !description || !videoPath) {

            res.status(400).json({ message: "all fields are required!!" })
        }
        const video = new Video({ title, description, videopath: videoPath });
        await video.save();

        res.status(201).json({ message: 'Video uploaded successfully', video });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const Fetch_video_withoutPagination = async (req, res, next) => {
    try {
        const videos = await Video.find();
        res.status(200).json({ videos });

    } catch (error) {
        console.log(err);
        res.status(500).json({ messgage: "Internal Server Error" })
    }

}


const FetchVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const total = await Video.countDocuments();
        const videos = await Video.find().skip(startIndex).limit(limit);

        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit: limit
            };
        }

        res.status(200).json({ total: total, videos: videos, pagination: pagination });

    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const Update_video = async (req, res, next) => {

    try {
        const { id } = req.params;
        await Video.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: "Video Updated Successfully!!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

const Delete_Video = async (req, res) => {
    try {
        const { id } = req.params;
        await Video.findByIdAndDelete(id);
        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}



export { upload, Upload_Video, FetchVideos, Fetch_video_withoutPagination, Delete_Video, Update_video }