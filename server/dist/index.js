import dotenv from "dotenv";
dotenv.config({
    path: "./.env", // load environment variables from .env in backend root
});
import connectDB from "./db/index.js";
import { app } from "./app.js";
connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on ${process.env.PORT || 8000}`);
    });
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});
// import app from "./app";
// import { env, connectDB } from "./config";
// const startServer = async () => {
//   await connectDB();
//   app.listen(env.PORT, () => {
//     console.log(`🚀 Server running on port ${env.PORT}`);
//   });
// };
// startServer();
