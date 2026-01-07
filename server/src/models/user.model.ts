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
        trim:true,
        index:true
    },
    avatar:{
        type:String, // cloudinary url
        
    },
    coverImage:{
        type:String, // cloudinary url
    },
    password:{
        type:String,
        required:[true, "Password is required"],
    },
    mobileNumber:{
        type: String,
        match: [/^[6-9]\d{9}$/, "Invalid mobile number"]
    },
    resetOtp: { type: String }, // To store the HASHED OTP
    otpExpiry: { type: Date }
}
,{
    timestamps: true
});
export const User = mongoose.model("User", userSchema);
