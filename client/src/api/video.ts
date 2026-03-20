import axios from "axios";

export const getVideos = async () => {
  const res = await axios.get("http://localhost:8000/api/v1/videos");
  return res.data; // { success, data }
};