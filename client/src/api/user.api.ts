import api from "./axios";

// Types (optional but recommended)
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

//  Register user
export const registerUser = (data: RegisterPayload) => {  
  const formData = new FormData();

  if (data.username) formData.append("username", data.username);
  if (data.fullName) formData.append("fullName", data.fullName);
  if (data.email) formData.append("email", data.email);
  if (data.password) formData.append("password", data.password);
  
  if (data.avatar) {
    formData.append("avatar", data.avatar);
    console.log("Avatar file:", data.avatar);
  }else{
    formData.append("avatar", new Blob(), "https://cdn.freecodecamp.org/curriculum/css-photo-gallery/3.jpg");
    console.log("No avatar provided, using default image.");
  }

  if (data.coverImage) {
    formData.append("coverImage", data.coverImage);
  }

  return api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//  Login user
export const loginUser = async (data: LoginPayload) => {
  const response = await api.post("/users/login", data);
  return response.data;
};
//  Logout
export const logoutUser = () => {
  return api.post("/users/logout");
};

//  Get current logged-in user
export const getProfile = () => {
  return api.get("/user/profile");
};

//  Update profile
export const updateUserProfile = (data: FormData) => {
  return api.put("/user/update-profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Change password
export const changePassword = (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  return api.put("/user/change-password", data);
};
export const refreshToken = () => {
  return api.get("/user/refresh-token");
}
export const updateUserAvatar = (avatar: File) => {
     const formData = new FormData();
  formData.append("avatar", avatar);
  return api.put("/user/update-avatar", avatar)
};

export const updateUserCoverImage = (coverImage: File) => {
  const formData = new FormData();
  formData.append("coverImage", coverImage);
};

export const getUserChannelProfile = (username: string) => {
  return api.get(`/user/c/${username}`);
}
export const getWatchHistory = () => {
  return api.get("/user/history");
}
export * from "./user.api";