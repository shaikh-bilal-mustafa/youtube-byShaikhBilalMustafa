import { Router } from "express";

import {registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePassword,
  getProfile,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  updateProfile,

 } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
           name:"coverImage",
           maxCount:1
        }
    ]),registerUser)
 

router.route("/login").post(loginUser);
//secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").get(verifyJWT, refreshAccessToken);
router.route("/update-password").put(verifyJWT, updatePassword);
router.route("/profile").get(verifyJWT, getProfile);
router.route("/update-profile").put(verifyJWT, updateProfile);

router.route("/update-avatar").put(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/update-cover-image").put(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;