import mongoose, { Schema, Document } from "mongoose";
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from "../config/env.js";

export interface IUser extends Document {
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  password: string;
  mobileNumber?: string;
  resetOtp?: string;
  otpExpiry?: Date;
  refreshToken?: string;

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}
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
        trim:true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    fullName:{
        type:String,
        required: true,
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
        minlength: [6, "Password must be at least 6 characters long"]
    },
    mobileNumber:{
        type: String,
        unique: true,
        sparse: true,
        match: [/^[6-9]\d{9}$/, "Invalid mobile number"]
    },
    resetOtp: { type: String }, // To store the HASHED OTP
    otpExpiry: { type: Date },
    refreshToken:{
        type:String
    }
}
,{
    timestamps: true
});

userSchema.pre<IUser>("save", async function () {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function(password : string){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function():string{
    if (!env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
       env.ACCESS_TOKEN_SECRET! as Secret,
        {
            expiresIn: env.ACCESS_TOKEN_EXPIRY as string | number
        } as jwt.SignOptions
    )
}
userSchema.methods.generateRefreshToken = function():string  {
  if (!env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }
  return jwt.sign(
    {
      _id: this._id,
    },
    
    env.REFRESH_TOKEN_SECRET! as Secret,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRY as string | number
    } as jwt.SignOptions
  );
};
export const User = mongoose.model("User", userSchema);
