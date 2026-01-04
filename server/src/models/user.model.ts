import mongoose from "mongoose";

const userSchema  = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true
    },
    email:{ 
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, // cloudinary url
        required:true
    },
    coverImage:{
        type:String, // cloudinary url
    },
    password:{
        type:String,
        required:[true, "Password is required"],
    },
    mobileNumber:{
        type:String,
        required:false,
        unique:true,
        match: /^\+[1-9]\d{10,14}$/
    },
    resetOtp: { type: String }, // To store the HASHED OTP
    otpExpiry: { type: Date }
}
,{
    timestamps: true
});
export const User = mongoose.model("User", userSchema);
