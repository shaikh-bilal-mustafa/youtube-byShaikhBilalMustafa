import axios from "axios";

export const getVideos = async () => {
  const res = await axios.get("/api/v1/videos/");
  return res.data; // { success, data }
};

export const searchVideos = async (query: string) => {
  const res = await axios.get("/api/v1/videos/search", {
    params: { q: query },
  });
  return res.data; // { success, data }
}