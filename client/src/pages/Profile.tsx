import React, { useEffect, useState } from "react";
import {
  getProfile,
  updateUserProfile,
  updateUserAvatar,
  updateUserCoverImage,
  logoutUser,
  changePassword,
} from "../api/user.api";
import { getMyVideos } from "../api/video";
import { getSubscriptionCount } from "../api/subscription";
import { VideoCard } from "../components/VideoCard";
import type { Video } from "../components/VideoCard";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState<{
      password?: string;
      backend?: string;
    }>({});
  const DEFAULT_AVATAR =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const DEFAULT_COVER =
    "https://images.unsplash.com/photo-1503264116251-35a269479413";
  const [user, setUser] = useState({
    _id: "",
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: DEFAULT_AVATAR,
    coverImage: DEFAULT_COVER,
  });
  const [originalUser, setOriginalUser] = useState(user);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const res = await getProfile();
        const userdata = res.data.data;
        const updatedUser = {
          _id: userdata._id || "",
          fullName: userdata.fullName ?? "",
          username: userdata.username ?? "",
          email: userdata.email ?? "",
          password :userdata.password ?? "",
          avatar: userdata.avatar || DEFAULT_AVATAR,
          coverImage: userdata.coverImage || DEFAULT_COVER,
        };
        setUser(updatedUser);
        setOriginalUser(updatedUser);
        // Load subscriber count
        try {
          const count = await getSubscriptionCount(updatedUser._id);
          setSubscriberCount(count);
        } catch (error) {
          console.error("Failed to load subscriber count:", error);
        }
      } catch (error: any) {
        const backendMessage = error.response?.data?.message;
       setErrors({ backend: backendMessage || "Failed to load profile. Please try again." });
      }
    };
    const loadUserVideos = async () => {
      try {
        const res = await getMyVideos();
        setVideos(res.data.videos || []);
        // Assuming user._id is set, but since it's async, use the loaded user
        // For now, set after user is loaded
      } catch (error) {
        console.error("Failed to load videos:", error);
      }
    };
    loadUserProfile();
    loadUserVideos();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "coverImage",
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUser({ ...user, [type]: url });
      if (type === "avatar") {
        setAvatarFile(file);
      } else {
        setCoverImageFile(file);
      }
    }
  };

  const handellogout = () => {
    logoutUser();
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

 
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update profile text fields (send as JSON, not FormData)
      await updateUserProfile({
        fullName: user.fullName,
        email: user.email,
        username: user.username,
      });

      // Update avatar if changed
      if (avatarFile) {
        await updateUserAvatar(avatarFile);
      }

      // Update cover if changed
      if (coverImageFile) {
        await updateUserCoverImage(coverImageFile);
      }
      if(user.password) {
        await changePassword({
          oldPassword: originalUser.password,
          newPassword: user.password,
        });
      }
      

      // Reload profile to get updated data
      const res = await getProfile();
      const userdata = res.data.data;
      const updatedUser = {
        _id: userdata._id || "",
        fullName: userdata.fullName ?? "",
        username: userdata.username ?? "",
        email: userdata.email ?? "",
        password :userdata.password ?? "",
        avatar: userdata.avatar || DEFAULT_AVATAR,
        coverImage: userdata.coverImage || DEFAULT_COVER,
      };
      setUser(updatedUser);
      setOriginalUser(updatedUser);
      setAvatarFile(null);
      setCoverImageFile(null);
      setIsEditing(false);
    } catch (e:any) {
      console.error("Error saving profile:", e);
       
        setErrors({ backend: e.response?.data?.message || "Failed to save profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUser(originalUser);
    setAvatarFile(null);
    setCoverImageFile(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
         {errors.backend && (
                <p className="text-sm text-red-500 flex items-center gap-1 p-2 bg-red-100 rounded">
                  {errors.backend}
                </p>
              )}

        {/* Cover Image */}
        <div className="relative">
          <img
            src={user.coverImage}
            alt="cover"
            className="w-full h-40 sm:h-56 object-cover"
          />

          {isEditing && (
            <label className="absolute top-2 right-2 bg-white px-3 py-1 text-sm rounded shadow cursor-pointer hover:bg-gray-100">
              Change Cover
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleImageChange(e, "coverImage")}
              />
            </label>
          )}
        </div>

        {/* Avatar */}
        <div className="relative flex justify-center">
          <div className="absolute -top-12">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
            />

            {isEditing && (
              <label className="block text-center mt-2 text-xs text-blue-600 cursor-pointer hover:underline">
                Change Avatar
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "avatar")}
                />
              </label>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-16 p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            {isEditing ? (
              <input
                aria-label="Full Name"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-lg font-semibold">{user.fullName}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-gray-500">Username</label>
            {isEditing ? (
              <input
                aria-label="Username"
                name="username"
                value={user.username}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-gray-700">@{user.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            {isEditing ? (
              <input
                aria-label="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-gray-700">{user.email}</p>
            )}
          </div>
          {/* Password (only show in edit mode) */}
          {isEditing && (
            <div>
              <p>if want to change password</p>
              <label className="text-sm text-gray-500">New Password</label>
              <input
                aria-label="New Password"
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
            <button
              onClick={() => {
                // Add your logout logic here
                handellogout();
              }}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-semibold mb-4">Channel Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{videos.length}</p>
              <p className="text-gray-600">Videos</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {videos.reduce((sum, video) => sum + (video.views || 0), 0)}
              </p>
              <p className="text-gray-600">Total Views</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{subscriberCount}</p>
              <p className="text-gray-600">Subscribers</p>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="p-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Videos</h2>
            <button
              onClick={() => window.location.href = "/upload"}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload Video
            </button>
          </div>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onClick={() => {/* handle video click */}}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No videos uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
