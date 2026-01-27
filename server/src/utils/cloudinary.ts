import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// console.log("Cloudinary key:", process.env.CLOUDINARY_API_KEY);
const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });
    // file has been uploaded successfull
    // console.log("file is uploaded on cloudinary ", response.url);

    // fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
    console.error("Cloudinary error:", error);
    return null;
  } finally {
    if (fs.existsSync(localFilePath)) {
      fs.unlink(localFilePath, (err) => {
        if (err) console.log("file deleted failed", err);
      });
    }
  }
};

export { uploadOnCloudinary };
