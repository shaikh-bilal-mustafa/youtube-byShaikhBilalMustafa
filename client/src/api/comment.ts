// const postComment = async () => {
//   await fetch("/api/comments", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       content: comment,
//       videoId,
//     }),
//   });
// };


const fetchComments = async (videoId: string) => {
  try {
    const res = await fetch(`/api/comments/${videoId}`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch comments", error);
  }
};
export { fetchComments };