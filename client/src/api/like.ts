import axios from "axios";

const toggleLike = (videoId: string) =>
  axios.post(
    `http://localhost:8000/api/v1/like/toggle/${videoId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );

const getLikeCount = (videoId: string) =>
  axios.get(`http://localhost:8000/api/v1/like/count/${videoId}`);

const getLikeStatus = (videoId: string) =>
  axios.get(`http://localhost:8000/api/v1/like/status/${videoId}`);

export { toggleLike, getLikeCount, getLikeStatus };
