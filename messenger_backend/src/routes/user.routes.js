import { Router } from "express";
import {
  registerUser,
  loginUser,
  logOut,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  toggleAccountType,
  updateUserAvatar,
  getUserById,
  searchUsers,
  getUserByUsername
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// public routes
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);


// protected routes
router.post("/logout", verifyJWT, logOut);
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/update", verifyJWT, updateAccountDetails);
router.patch("/toggle-account-type", verifyJWT, toggleAccountType);
router.patch(
  "/avatar",
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar
);
router.patch("/change-password", verifyJWT, changeCurrentPassword);
router.get("/search",verifyJWT,searchUsers);
router.get("/:userId", verifyJWT, getUserById);
router.get(
  "/:username",
  verifyJWT,
  getUserByUsername
);




export default router;
