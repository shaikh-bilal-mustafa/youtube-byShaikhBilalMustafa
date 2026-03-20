import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js";

export const videoById = asyncHandler(async(req, _, next) => {
try{

}catch(error:any){
    throw new ApiError(401, "Video not found in middleware");
}
})  