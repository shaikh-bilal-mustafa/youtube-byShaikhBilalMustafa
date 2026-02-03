import { Router, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
// const router = Router();
const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:8000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express.json({
    limit: "16kb",
}   
));
app.use(urlencoded({ extended: true , limit :'16kb'}));
app.use(express.static("public"));
app.use(cookieParser());
app.use((req: Request, res: Response, next) => {
    res.header("Access-Control-Allow-Origin", "*");// want to remove imedeitly
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

import userRouter from "./routes/user.route.js";
app.get("/test", (req: Request, res: Response) => {
  res.send("Server working");
});
app.use("/api/v1/users", userRouter);

import videoRouter from "./routes/video.route.js";
app.use("/api/v1/videos", videoRouter);
export { app };