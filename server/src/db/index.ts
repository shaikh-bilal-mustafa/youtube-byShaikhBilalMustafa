import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
try{
    const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(`\n Connected to MongoDB DB Host: ${connectionInstance.connection.host} \n`);
}catch(err){
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
}
}
export default connectDB;