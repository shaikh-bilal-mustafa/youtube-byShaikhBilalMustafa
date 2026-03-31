// import axios from "axios";
import type { VideoUploadData } from "../pages/UploadVideo";
import api from "./axios";

export const getVideos = async () => {

  return api.get("/videos/"  );       // { success, data } 
};
export const searchVideos = async (query: string) => {
  return api.get("/videos/search", {
    params: { q: query },
  }); // { success, data }
}

export const getAllVideos = async (page: number = 1, limit: number = 10) => {
  return api.get("/videos/all", {
    params: { page, limit },
  }); // { success, data }
};

export const getTrendingVideos = async () => {
  return api.get("/videos/trending"); // { success, data }
};

export const getMyVideos = async () => {
  return api.get("/videos/my"); // { success, data }
};

export const deleteVideo = async (videoId: string) => {
  return api.delete(`/videos/${videoId}`); // { success, data }
};

export const uploadVideo = async (data: VideoUploadData) => {
  const formData = new FormData();

 // Dynamically append all available data
  // Object.entries(data).forEach(([key, value]) => {
  //   if (value !== undefined && value !== null) {
  //     // If tags is an array, you might need to stringify it or append multiple times
  //     if (key === 'tags' && Array.isArray(value)) {
  //       formData.append(key, JSON.stringify(value));
  //     } else {
  //       formData.append(key, value as string | Blob);
  //     }
  //   }
  // });
  if(data.visibility) formData.append("visibility", data.visibility);
  if(data.title)formData.append("title", data.title);
  if(data.description)formData.append("description", data.description);
  if(data.videoFile)  formData.append("videoFile", data.videoFile!);
  if(data.thumbnailUrl) formData.append("thumbnailUrl", data.thumbnailUrl!);
  for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
  return  api.post("/videos/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }); // { success, data }
}
 