import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  createCoordinatorController,
  createOrganizerController,
  deleteCoordinatorController,
  deleteOrganizerController,
  deleteUserController,
  getAdminContactMessagesController,
  getAdminUnreadContactCountController,
  getAllUsersController,
  getCoordinatorsController,
  getOrganizersController,
  markAdminContactMessageReadController,
  markAllAdminContactMessagesReadController,
  updateCoordinatorController,
  updateOrganizerController,
  updateUserController,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("MAIN_ADMIN"));

router.get("/users", getAllUsersController);
router.put("/users/:id", updateUserController);
router.delete("/users/:id", deleteUserController);

router.get("/organizers", getOrganizersController);
router.post("/organizers", createOrganizerController);
router.put("/organizers/:id", updateOrganizerController);
router.delete("/organizers/:id", deleteOrganizerController);

router.get("/coordinators", getCoordinatorsController);
router.post("/coordinators", createCoordinatorController);
router.put("/coordinators/:id", updateCoordinatorController);
router.delete("/coordinators/:id", deleteCoordinatorController);

router.get("/contact-messages", getAdminContactMessagesController);
router.get("/contact-messages/unread-count", getAdminUnreadContactCountController);
router.patch("/contact-messages/:id/read", markAdminContactMessageReadController);
router.patch("/contact-messages/read-all", markAllAdminContactMessagesReadController);

export default router;
