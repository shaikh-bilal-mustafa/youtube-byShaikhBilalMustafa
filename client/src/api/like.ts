import api from "./axios";

const toggleLike = (videoId: string) =>
  api.post(`/like/toggle/${videoId}`);

const getLikeCount = async (videoId: string) => {
  const res = await api.get(`/like/count/${videoId}`);
  return res.data.data?.count ?? 0;
};

const getLikeStatus = async (videoId: string) => {
  try {
    const res = await api.get(`/like/status/${videoId}`);
    return res.data.data?.liked ?? false;
  } catch (error) {
    // not logged in or status unavailable
    return false;
  }
};

export { toggleLike, getLikeCount, getLikeStatus };
