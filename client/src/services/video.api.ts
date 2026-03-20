// src/services/video.api.ts
import axios from "axios";

export const searchVideos = async () => {
  const { data } = await axios.get(
    `http://localhost:8000/api/v1/videos/`
  );
  return data.data;
};
