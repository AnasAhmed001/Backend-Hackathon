import express from "express";
import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  uploadImage,
} from "../controllers/auth.controllers.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refreshtoken", refreshToken);
router.post("/upload", upload.single("image"), uploadImage);
// router.post("/register", upload.single("image"), registerUser);

export default router;