import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import { createStudentCoordinator } from "../controllers/user.controller.js";
import User from "../models/User.model.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  const user =  await User.findById(req.user.userId).select("-password");
  res.json({success: true, user});
});

router.post(
  "/create-student-coordinator",
  authMiddleware,
  roleMiddleware("MAIN_ADMIN", "ORGANIZER"),
  createStudentCoordinator
);

export default router;