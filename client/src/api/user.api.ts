import api from "./axios";

export interface RegisterPayload {
  username?: string;
  email?: string;
  password?: string;
  avatar?: File; // for profile picture upload
  coverImage?: File; // for cover image upload
  fullName?: string;
}

export interface LoginPayload {
  email?: string;
  password: string;
  username?: string; // optional if login by email
}

export const registerUser = (data: RegisterPayload) => {
  const formData = new FormData();

  if (data.username) formData.append("username", data.username);
  if (data.fullName) formData.append("fullName", data.fullName);
  if (data.email) formData.append("email", data.email);
  if (data.password) formData.append("password", data.password);
  if (data.avatar) formData.append("avatar", data.avatar);
  if (data.coverImage) formData.append("coverImage", data.coverImage);

  return api.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const loginUser = async (data: LoginPayload) => {
  const response = await api.post("/users/login", data);
  return response;
};

export const logoutUser = () => {
  return api.post("/users/logout");
};

export const getProfile = () => {
  return api.get("/users/profile");
};

export const updateUserProfile = (data: { fullName: string; email: string; username: string }) => {
  return api.put("/users/update-profile", data);
};

export const changePassword = (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  return api.put("/users/update-password", data);
};

export const refreshToken = () => {
  return api.get("/users/refresh-token");
};

export const updateUserAvatar = (avatar: File) => {
  const formData = new FormData();
  formData.append("avatar", avatar);
  return api.put("/users/update-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateUserCoverImage = (coverImage: File) => {
  const formData = new FormData();
  formData.append("coverImage", coverImage);
  return api.put("/users/update-cover-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getUserChannelProfile = (username: string) => {
  return api.get(`/users/c/${username}`);
};

export const getWatchHistory = () => {
  return api.get("/users/history");
};