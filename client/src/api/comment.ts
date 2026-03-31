import api from "./axios";

export const fetchComments = async (videoId: string) => {
  try {
    const res = await api.get(`/comments/${videoId}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch comments", error);
    return [];
  }
};

export const addComment = async (videoId: string, content: string) => {
  if (!content.trim()) return null;

  const res = await api.post("/comments", { videoId, content });
  return res.data.data;
};

export const deleteComment = async (commentId: string) => {
  const res = await api.delete(`/comments/${commentId}`);
  return res.data;
};