import { Router, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import env from "./config/env.js";
const app = express();
// If CLIENT_URL is set to '*' we allow all origins by reflecting the request origin.
// This keeps `credentials: true` working because the cors middleware will echo
// back the incoming `Origin` header instead of sending a literal '*'.
const corsOrigin = env.CLIENT_URL === "*"
  ? true
  : (env.CLIENT_URL ? [env.CLIENT_URL] : ["http://localhost:5173"]);

app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
app.use(express.json({
    limit: "500mb",
}   
));
app.use(urlencoded({ extended: true , limit : "500mb"}));
app.use(express.static("public"));
app.use(cookieParser());
// Removed problematic CORS override middleware

import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import userRouter from "./routes/user.route.js";
app.get("/test", (req: Request, res: Response) => {
  res.send("Server working");
});
app.use("/api/v1/users", userRouter);

import videoRouter from "./routes/video.route.js";
app.use("/api/v1/videos", videoRouter);

import commentRouter from "./routes/comment.route.js";
app.use("/api/v1", commentRouter);

import likeRouter from "./routes/like.route.js";
app.use("/api/v1/like", likeRouter);

import subscriptionRouter from "./routes/subscription.route.js";
app.use("/api/v1/subscription", subscriptionRouter);
// Global error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("GLOBAL ERROR:", err);
  if (err instanceof ApiError) {
    return res
      .status(err.code)
      .json(new ApiResponse(err.code, null, err.message));
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json(new ApiResponse(statusCode, null, message));
});

export { app };