import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50,
        required: [true, "Name is required"]
    },

    email: {
       type: String,
       trim: true,
       required: [true, "email is required"],
       lowercase: true,
       unique: true 
    },

    password: {
        type: String,
        required: [true, "password is required"],
        minlength: 8,
        select: false,
    },
    
    role: {
        type: String,
        enum : ["customer", "admin"],
        default: "customer"
    },

    isVerified: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model("User", userSchema)