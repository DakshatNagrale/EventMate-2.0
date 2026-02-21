import express from "express";
import { registerUserController, verifyEmailController, loginController, logoutController } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimit.middleware.js";
import { refreshTokenController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerLimiter, registerUserController);
router.post("/verify-email", verifyEmailController);
router.post("/login", loginLimiter, loginController);
router.post("/logout", authMiddleware, logoutController);
router.post("/refresh-token", refreshTokenController);

export default router;
