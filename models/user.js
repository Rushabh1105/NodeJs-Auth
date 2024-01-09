// Importing required modues and dependencies
import mongoose from "mongoose";

// Making the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required : true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps: true});

const UserModel = mongoose.model('User', userSchema);
// Exporting the user model
export default UserModel;