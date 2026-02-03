import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

const generateThumbnail = (videoPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const thumbnailsDir = path.join("uploads", "thumbnails");

    // ensure directory exists
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
    }

    const thumbnailPath = path.join(
      thumbnailsDir,
      `thumb-${Date.now()}.png`
    );

    ffmpeg(videoPath)
      .seekInput("00:00:01") // take frame at 1 sec
      .frames(1)
      .outputOptions("-q:v 2")
      .output(thumbnailPath)
      .on("end", () => resolve(thumbnailPath))
      .on("error", (err) => reject(err))
      .run();
  });
};
 const getVideoDuration = (videoPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);

      const duration = metadata.format?.duration;

      if (!duration) {
        return reject(new Error("Could not fetch video duration"));
      }

      resolve(Math.floor(duration)); // seconds
    });
  });
}; 
export { generateThumbnail ,getVideoDuration};
