import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import { createStudentCoordinator } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", authMiddleware, (req, res)=>{
  res.status(200).json({
  message: "User profile fetched",
  user: req.user
});
})

router.post(
  "/create-student-coordinator",
  authMiddleware,
  roleMiddleware("MAIN_ADMIN", "ORGANIZER"),
  createStudentCoordinator
);

export default router;