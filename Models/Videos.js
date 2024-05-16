import mongoose from "mongoose";


const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    videopath: { type: String, required: true }

});

export default mongoose.model('videos', VideoSchema);