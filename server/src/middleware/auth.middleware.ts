import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt ,{ JwtPayload } from "jsonwebToken"
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
       throw new ApiError(500, "ACCESS_TOKEN_SECRET is not defined");
       }
         const decodedToken = jwt.verify(token, secret) as JwtPayload & {
      _id: string;
    };
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error:any) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})