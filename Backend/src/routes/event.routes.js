import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import upload from "../middleware/multer.middleware.js";
import {
  createEventController,
  createEventCoordinatorController,
  getMyRegisteredEventsController,
  getOrganizerCoordinatorActivityController,
  getAvailableCoordinatorsController,
  getMyEventsController,
  getPublicEventDetailsController,
  getPublicEventsController,
  registerForEventController,
  updateEventController,
  updateEventCoordinatorController,
} from "../controllers/event.controller.js";

const router = express.Router();

router.get("/public", getPublicEventsController);
router.get("/public/:eventId", getPublicEventDetailsController);

router.get(
  "/mine",
  authMiddleware,
  roleMiddleware("MAIN_ADMIN", "ORGANIZER"),
  getMyEventsController
);

router.get(
  "/my-registrations",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getMyRegisteredEventsController
);

router.get(
  "/coordinators",
  authMiddleware,
  roleMiddleware("MAIN_ADMIN", "ORGANIZER"),
  getAvailableCoordinatorsController
);

router.post(
  "/coordinators",
  authMiddleware,
  roleMiddleware("MAIN_ADMIN", "ORGANIZER"),
  createEventCoordinatorController
);

router.patch(
  "/coordinators/:id",
  authMiddleware,
  roleMiddleware("MAIN_ADMIN", "ORGANIZER"),
  updateEventCoordinatorController
);

router.get(
  "/organizer/coordinator-activity",
  authMiddleware,
  roleMiddleware("ORGANIZER"),
  getOrganizerCoordinatorActivityController
);

router.post(
  "/:eventId/register",
  authMiddleware,
  roleMiddleware("STUDENT"),
  registerForEventController
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("MAIN_ADMIN", "ORGANIZER"),
  upload.single("poster"),
  createEventController
);

router.put(
  "/:eventId",
  authMiddleware,
  roleMiddleware("MAIN_ADMIN", "ORGANIZER"),
  upload.single("poster"),
  updateEventController
);

export default router;
