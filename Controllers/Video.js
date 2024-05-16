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
        const videoPath = req.file.path; // File path provided by multer

        if (!title || !description || !videoPath) {

            res.status(400).json({ message: "all fields are required!!" })
        }
        // Create new video document
        const video = new Video({ title, description, videopath: videoPath });
        await video.save();

        res.status(201).json({ message: 'Video uploaded successfully', video });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { upload, Upload_Video, FetchVideos }