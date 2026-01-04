import dotenv from "dotenv";
dotenv.config({
    path: "./.env",  // load environment variables from .env in backend root
});
import connectDB from "./db/index.js";
import { app } from "./server.js";

connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {    
        console.log("Server is running on ${process.env.PORT || 8000}");
    });    
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});