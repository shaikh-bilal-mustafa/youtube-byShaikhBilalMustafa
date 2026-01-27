import { Router, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
const router = Router();
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
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

import userRouter from "./routes/user.route.js";
app.get("/test", (req: Request, res: Response) => {
  res.send("Server working");
});

  app.use("/api/v1/users", userRouter);
export { app };