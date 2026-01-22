import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';
import { createOrganizer } from "../controllers/admin.controller.js";

const router=express.Router();

router.post(
  "/create-organizer",
  authMiddleware,
  roleMiddleware("MAIN_ADMIN"),
  createOrganizer
  );

export default router;