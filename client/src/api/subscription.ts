import api from "./axios";

export const toggleSubscription = async (channelId: string) => {
  const res = await api.post(`/subscription/toggle/${channelId}`);
  return res.data;
};

export const getSubscriptionCount = async (channelId: string) => {
  const res = await api.get(`/subscription/count/${channelId}`);
  return res.data.data?.count || 0;
};

export const getSubscriptionStatus = async (channelId: string) => {
  const res = await api.get(`/subscription/status/${channelId}`);
  return res.data.data?.isSubscribed || false;
};

export const getSubscriptionVideos = async () => {
  const res = await api.get("/subscription/videos");
  return res.data;
};
