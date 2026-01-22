import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, (req, res)=>{
  res.status(200).json({
  message: "User profile fetched",
  user: req.user
});
})

export default router;