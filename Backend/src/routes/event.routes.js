import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import upload from "../middleware/multer.middleware.js";
import {
  createEventController,
  getAvailableCoordinatorsController,
  getMyEventsController,
  getPublicEventsController,
} from "../controllers/event.controller.js";

const router = express.Router();

router.get("/public", getPublicEventsController);

router.get(
  "/mine",
  authMiddleware,
  roleMiddleware("MAIN_ADMIN", "ORGANIZER"),
  getMyEventsController
);

router.get(
  "/coordinators",
  authMiddleware,
  roleMiddleware("MAIN_ADMIN", "ORGANIZER"),
  getAvailableCoordinatorsController
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("MAIN_ADMIN", "ORGANIZER"),
  upload.single("poster"),
  createEventController
);

export default router;
