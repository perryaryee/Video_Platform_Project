import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isverified: { type: Boolean, required: false },
    verification_code: { type: String, required: true },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: String, required: false }

});

export default mongoose.model('users', UserSchema);