import Event from "../models/Event.model.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";

const VALID_EVENT_STATUSES = new Set(["Draft", "Published", "Completed", "Cancelled"]);

const parseJsonPayload = (value, fallback = null) => {
  if (typeof value === "undefined" || value === null || value === "") return fallback;
  return JSON.parse(value);
};

export const createEventController = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    venue,
    schedule,
    registration,
    certificate,
    feedback,
    status,
    studentCoordinators,
    sendNotification,
  } = req.body;

  if (!title || !category) {
    return res.status(400).json({
      success: false,
      message: "Title and category are required"
    });
  }

  const resolvedStatus = VALID_EVENT_STATUSES.has(status) ? status : "Draft";

  if (!req.file && resolvedStatus === "Published") {
    return res.status(400).json({
      success: false,
      message: "Event banner is required to publish."
    });
  }

  let posterUrl = "";
  if (req.file) {
    const uploaded = await uploadImageCloudinary(req.file);
    posterUrl = uploaded.url;
  }

  let parsedVenue;
  let parsedSchedule;
  let parsedRegistration;
  let parsedCertificate;
  let parsedFeedback;
  let parsedStudentCoordinators;

  try {
    parsedVenue = parseJsonPayload(venue, undefined);
    parsedSchedule = parseJsonPayload(schedule, undefined);
    parsedRegistration = parseJsonPayload(registration, { isOpen: false, fee: 0 });
    parsedCertificate = parseJsonPayload(certificate, { isEnabled: false });
    parsedFeedback = parseJsonPayload(feedback, { enabled: false });
    parsedStudentCoordinators = parseJsonPayload(studentCoordinators, []);
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid structured event payload."
    });
  }

  const sanitizedStudentCoordinators = Array.isArray(parsedStudentCoordinators)
    ? parsedStudentCoordinators
        .map((item) => {
          const coordinatorIdRaw = item?.coordinatorId;
          const coordinatorId =
            coordinatorIdRaw && mongoose.Types.ObjectId.isValid(coordinatorIdRaw)
              ? new mongoose.Types.ObjectId(coordinatorIdRaw)
              : null;

          return {
            coordinatorId,
            name: String(item?.name || "").trim(),
            email: String(item?.email || "").trim().toLowerCase(),
          };
        })
        .filter((item) => item.name || item.email || item.coordinatorId)
    : [];

  const event = await Event.create({
    title,
    description,
    category,
    posterUrl,

    organizer: {
      organizerId: req.user._id,
      name: req.user.fullName,
      department: req.user.professionalProfile?.department || "",
      contactEmail: req.user.email,
      contactPhone: req.user.mobileNumber || ""
    },

    venue: parsedVenue,
    schedule: parsedSchedule,
    registration: parsedRegistration,
    certificate: parsedCertificate,
    feedback: parsedFeedback,
    studentCoordinators: sanitizedStudentCoordinators,
    notifications: {
      sendToStudents: sendNotification === "true" || sendNotification === true,
    },
    status: resolvedStatus,

    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    message: resolvedStatus === "Published" ? "Event published successfully." : "Event saved as draft successfully.",
    data: event
  });
});

export const getMyEventsController = asyncHandler(async (req, res) => {
  const role = req.user?.role;
  const query = role === "MAIN_ADMIN"
    ? {}
    : { "organizer.organizerId": req.user._id };

  const events = await Event.find(query)
    .sort({ createdAt: -1 })
    .select("title category status posterUrl venue schedule registration createdAt updatedAt organizer studentCoordinators");

  res.json({ success: true, events });
});

export const getPublicEventsController = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: "Published" })
    .sort({ "schedule.startDate": 1, createdAt: -1 })
    .select("title description category posterUrl venue schedule registration status createdAt organizer");

  res.json({ success: true, events });
});

export const getAvailableCoordinatorsController = asyncHandler(async (req, res) => {
  const coordinators = await User.find({ role: "STUDENT_COORDINATOR", isActive: true })
    .sort({ fullName: 1 })
    .select("fullName email coordinatorProfile");

  res.json({
    success: true,
    coordinators: coordinators.map((coordinator) => ({
      _id: coordinator._id,
      fullName: coordinator.fullName,
      email: coordinator.email,
      scope: coordinator.coordinatorProfile?.scope || "",
      assignedEventId: coordinator.coordinatorProfile?.assignedEventId || "",
    })),
  });
});
