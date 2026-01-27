import dotenv from "dotenv"
import type { SignOptions } from "jsonwebtoken";
dotenv.config();

const env = {
  PORT: Number(process.env.PORT) || 8000,
  MONGODB_URL: process.env.MONGODB_URL as string,
  CLINET_URL: process.env.CLIENT_URL as string,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  ACCESS_TOKEN_EXPIRY:process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
  REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET as string,
  REFRESH_TOKEN_EXPIRY:process.env.REFRESH_TOKEN_EXPIRY as string ?? "7d",
  CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};

// safety check
if (!env.MONGODB_URL) {
  throw new Error("❌ Missing required environment variables");
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is missing");
}
if (!process.env.REFRESH_TOKEN_EXPIRY) {
  throw new Error("REFRESH_TOKEN_EXPIRY is missing");
}
if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is missing");
}
if (!process.env.ACCESS_TOKEN_EXPIRY) {
  throw new Error("ACCESS_TOKEN_EXPIRY is missing");
}
export default env ;