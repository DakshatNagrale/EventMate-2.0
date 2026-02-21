import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/auth.middleware.js";
import { getProfileController, updateProfileController, uploadAvatarController, forgotPasswordController, resetPasswordController } from "../controllers/user.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes (no auth)
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

// Protected routes
router.use(authMiddleware);
router.get("/profile", getProfileController);
router.put("/profile", updateProfileController);
router.post("/avatar", upload.single("avatar"), uploadAvatarController);

export default router;
