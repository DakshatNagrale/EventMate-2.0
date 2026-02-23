import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../models/User.model.js";
import Event from "../models/Event.model.js";
import ContactMessage from "../models/ContactMessage.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ---------------- GET ALL USERS ----------------
export const getAllUsersController = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  res.json({ success: true, users });
});

// ---------------- UPDATE USER ----------------
export const updateUserController = asyncHandler(async (req, res) => {
  const updates = { ...(req.body || {}) };

  if (Object.prototype.hasOwnProperty.call(updates, "emailVerified")) {
    return res.status(400).json({
      success: false,
      message: "Email verification status is system managed and cannot be edited.",
    });
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ success: false, message: "No editable fields provided." });
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  res.json({ success: true, message: "User updated", user });
});

// ---------------- DELETE USER ----------------
export const deleteUserController = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
});

const ORGANIZER_SELECT = "-password -refreshToken -otp -otpExpiry";
const COORDINATOR_SELECT = "-password -refreshToken -otp -otpExpiry";
const COORDINATOR_STATUSES = new Set(["ACTIVE", "ON_HOLD", "SUSPENDED"]);

const sanitizeOrganizer = (organizer, totalEvents = 0) => ({
  _id: organizer._id,
  fullName: organizer.fullName,
  email: organizer.email,
  avatar: organizer.avatar || null,
  role: organizer.role,
  mobileNumber: organizer.mobileNumber || "",
  department: organizer.professionalProfile?.department || "",
  emailVerified: organizer.emailVerified,
  isActive: organizer.isActive,
  createdAt: organizer.createdAt,
  updatedAt: organizer.updatedAt,
  lastLoginAt: organizer.lastLoginAt || null,
  totalEvents,
});

const getOrganizerEventCounts = async () => {
  const eventCounts = await Event.aggregate([
    { $match: { "organizer.organizerId": { $ne: null } } },
    { $group: { _id: "$organizer.organizerId", totalEvents: { $sum: 1 } } },
  ]);

  const countMap = new Map();
  eventCounts.forEach((item) => {
    countMap.set(String(item._id), item.totalEvents);
  });

  return countMap;
};

// ---------------- GET ORGANIZERS ----------------
export const getOrganizersController = asyncHandler(async (req, res) => {
  const organizers = await User.find({ role: "ORGANIZER" }).sort({ createdAt: -1 }).select(ORGANIZER_SELECT);
  const eventCountMap = await getOrganizerEventCounts();

  const items = organizers.map((organizer) =>
    sanitizeOrganizer(organizer, eventCountMap.get(String(organizer._id)) || 0)
  );

  res.json({ success: true, organizers: items });
});

// ---------------- CREATE ORGANIZER ----------------
export const createOrganizerController = asyncHandler(async (req, res) => {
  const { fullName, email, password, department, mobileNumber } = req.body;

  if (!fullName || fullName.trim().length < 3) {
    return res.status(400).json({ success: false, message: "Full name must be at least 3 characters." });
  }

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Valid email is required." });
  }

  if (!password || String(password).length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
  }

  if (mobileNumber && !/^[6-9]\d{9}$/.test(String(mobileNumber))) {
    return res.status(400).json({ success: false, message: "Mobile number must be a valid 10-digit number." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ success: false, message: "Email already registered." });
  }

  const hashedPassword = await bcrypt.hash(String(password), 10);

  const organizer = await User.create({
    fullName: String(fullName).trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "ORGANIZER",
    mobileNumber: mobileNumber ? String(mobileNumber).trim() : undefined,
    professionalProfile: {
      department: department ? String(department).trim() : "",
      occupation: "Organizer",
    },
    emailVerified: true,
    isActive: true,
    createdBy: req.user._id,
  });

  const safeOrganizer = sanitizeOrganizer(organizer, 0);
  res.status(201).json({ success: true, message: "Organizer created successfully.", organizer: safeOrganizer });
});

// ---------------- UPDATE ORGANIZER ----------------
export const updateOrganizerController = asyncHandler(async (req, res) => {
  const organizer = await User.findOne({ _id: req.params.id, role: "ORGANIZER" }).select(ORGANIZER_SELECT);
  if (!organizer) {
    return res.status(404).json({ success: false, message: "Organizer not found." });
  }

  const { fullName, email, isActive, department, mobileNumber } = req.body;

  if (typeof req.body?.emailVerified !== "undefined") {
    return res.status(400).json({
      success: false,
      message: "Email verification status is system managed and cannot be edited.",
    });
  }

  if (typeof fullName !== "undefined") {
    if (!fullName || String(fullName).trim().length < 3) {
      return res.status(400).json({ success: false, message: "Full name must be at least 3 characters." });
    }
    organizer.fullName = String(fullName).trim();
  }

  if (typeof email !== "undefined") {
    const normalizedEmail = String(email).trim().toLowerCase();
    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, message: "Valid email is required." });
    }

    const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: organizer._id } });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    organizer.email = normalizedEmail;
  }

  if (typeof isActive === "boolean") {
    organizer.isActive = isActive;
  }

  if (typeof department !== "undefined") {
    organizer.professionalProfile = {
      ...(organizer.professionalProfile || {}),
      department: String(department || "").trim(),
      occupation: organizer.professionalProfile?.occupation || "Organizer",
    };
  }

  if (typeof mobileNumber !== "undefined") {
    const trimmedMobile = String(mobileNumber || "").trim();
    if (trimmedMobile && !/^[6-9]\d{9}$/.test(trimmedMobile)) {
      return res.status(400).json({ success: false, message: "Mobile number must be a valid 10-digit number." });
    }
    organizer.mobileNumber = trimmedMobile || undefined;
  }

  await organizer.save();
  const totalEvents = await Event.countDocuments({ "organizer.organizerId": organizer._id });
  res.json({
    success: true,
    message: "Organizer updated successfully.",
    organizer: sanitizeOrganizer(organizer, totalEvents),
  });
});

// ---------------- DELETE ORGANIZER ----------------
export const deleteOrganizerController = asyncHandler(async (req, res) => {
  const organizer = await User.findOneAndDelete({ _id: req.params.id, role: "ORGANIZER" });
  if (!organizer) {
    return res.status(404).json({ success: false, message: "Organizer not found." });
  }

  res.json({ success: true, message: "Organizer deleted successfully." });
});

const sanitizeCoordinator = (coordinator) => {
  const profile = coordinator.coordinatorProfile || {};
  const resolvedStatus = profile.status || (coordinator.isActive ? "ACTIVE" : "SUSPENDED");

  return {
    _id: coordinator._id,
    fullName: coordinator.fullName,
    email: coordinator.email,
    avatar: coordinator.avatar || null,
    role: coordinator.role,
    mobileNumber: coordinator.mobileNumber || "",
    assignedEventId: profile.assignedEventId || "",
    scope: profile.scope || coordinator.professionalProfile?.department || "",
    status: resolvedStatus,
    emailVerified: coordinator.emailVerified,
    isActive: coordinator.isActive,
    createdAt: coordinator.createdAt,
    updatedAt: coordinator.updatedAt,
    lastLoginAt: coordinator.lastLoginAt || null,
  };
};

// ---------------- GET COORDINATORS ----------------
export const getCoordinatorsController = asyncHandler(async (req, res) => {
  const coordinators = await User.find({ role: "STUDENT_COORDINATOR" })
    .sort({ createdAt: -1 })
    .select(COORDINATOR_SELECT);

  res.json({ success: true, coordinators: coordinators.map(sanitizeCoordinator) });
});

// ---------------- CREATE COORDINATOR ----------------
export const createCoordinatorController = asyncHandler(async (req, res) => {
  const { fullName, email, password, mobileNumber, assignedEventId, scope, status } = req.body;

  if (!fullName || fullName.trim().length < 3) {
    return res.status(400).json({ success: false, message: "Full name must be at least 3 characters." });
  }

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Valid email is required." });
  }

  if (!password || String(password).length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
  }

  if (mobileNumber && !/^[6-9]\d{9}$/.test(String(mobileNumber))) {
    return res.status(400).json({ success: false, message: "Mobile number must be a valid 10-digit number." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ success: false, message: "Email already registered." });
  }

  const resolvedStatus = String(status || "ACTIVE").toUpperCase();
  if (!COORDINATOR_STATUSES.has(resolvedStatus)) {
    return res.status(400).json({ success: false, message: "Invalid coordinator status." });
  }

  const hashedPassword = await bcrypt.hash(String(password), 10);

  const coordinator = await User.create({
    fullName: String(fullName).trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "STUDENT_COORDINATOR",
    mobileNumber: mobileNumber ? String(mobileNumber).trim() : undefined,
    professionalProfile: {
      department: scope ? String(scope).trim() : "",
      occupation: "Student Coordinator",
    },
    coordinatorProfile: {
      assignedEventId: assignedEventId ? String(assignedEventId).trim() : "",
      scope: scope ? String(scope).trim() : "",
      status: resolvedStatus,
    },
    emailVerified: true,
    isActive: resolvedStatus !== "SUSPENDED",
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Coordinator created successfully.",
    coordinator: sanitizeCoordinator(coordinator),
  });
});

// ---------------- UPDATE COORDINATOR ----------------
export const updateCoordinatorController = asyncHandler(async (req, res) => {
  const coordinator = await User.findOne({ _id: req.params.id, role: "STUDENT_COORDINATOR" }).select(COORDINATOR_SELECT);
  if (!coordinator) {
    return res.status(404).json({ success: false, message: "Coordinator not found." });
  }

  const { fullName, email, mobileNumber, assignedEventId, scope, status, isActive } = req.body;

  if (typeof req.body?.emailVerified !== "undefined") {
    return res.status(400).json({
      success: false,
      message: "Email verification status is system managed and cannot be edited.",
    });
  }

  if (typeof fullName !== "undefined") {
    if (!fullName || String(fullName).trim().length < 3) {
      return res.status(400).json({ success: false, message: "Full name must be at least 3 characters." });
    }
    coordinator.fullName = String(fullName).trim();
  }

  if (typeof email !== "undefined") {
    const normalizedEmail = String(email).trim().toLowerCase();
    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, message: "Valid email is required." });
    }

    const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: coordinator._id } });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    coordinator.email = normalizedEmail;
  }

  if (typeof mobileNumber !== "undefined") {
    const trimmedMobile = String(mobileNumber || "").trim();
    if (trimmedMobile && !/^[6-9]\d{9}$/.test(trimmedMobile)) {
      return res.status(400).json({ success: false, message: "Mobile number must be a valid 10-digit number." });
    }
    coordinator.mobileNumber = trimmedMobile || undefined;
  }

  coordinator.coordinatorProfile = {
    ...(coordinator.coordinatorProfile || {}),
    assignedEventId:
      typeof assignedEventId !== "undefined"
        ? String(assignedEventId || "").trim()
        : coordinator.coordinatorProfile?.assignedEventId || "",
    scope:
      typeof scope !== "undefined"
        ? String(scope || "").trim()
        : coordinator.coordinatorProfile?.scope || "",
    status: coordinator.coordinatorProfile?.status || "ACTIVE",
  };

  if (typeof scope !== "undefined") {
    coordinator.professionalProfile = {
      ...(coordinator.professionalProfile || {}),
      department: String(scope || "").trim(),
      occupation: coordinator.professionalProfile?.occupation || "Student Coordinator",
    };
  }

  if (typeof status !== "undefined") {
    const nextStatus = String(status).toUpperCase();
    if (!COORDINATOR_STATUSES.has(nextStatus)) {
      return res.status(400).json({ success: false, message: "Invalid coordinator status." });
    }
    coordinator.coordinatorProfile.status = nextStatus;
    coordinator.isActive = nextStatus !== "SUSPENDED";
  }

  if (typeof isActive === "boolean") {
    coordinator.isActive = isActive;
    if (!isActive) {
      coordinator.coordinatorProfile.status = "SUSPENDED";
    } else if (coordinator.coordinatorProfile.status === "SUSPENDED") {
      coordinator.coordinatorProfile.status = "ACTIVE";
    }
  }

  await coordinator.save();

  res.json({
    success: true,
    message: "Coordinator updated successfully.",
    coordinator: sanitizeCoordinator(coordinator),
  });
});

// ---------------- DELETE COORDINATOR ----------------
export const deleteCoordinatorController = asyncHandler(async (req, res) => {
  const coordinator = await User.findOneAndDelete({ _id: req.params.id, role: "STUDENT_COORDINATOR" });
  if (!coordinator) {
    return res.status(404).json({ success: false, message: "Coordinator not found." });
  }

  res.json({ success: true, message: "Coordinator deleted successfully." });
});

// ---------------- CONTACT MESSAGES ----------------
export const getAdminContactMessagesController = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
  const unreadOnly = String(req.query.unreadOnly || "").toLowerCase() === "true";

  const query = unreadOnly ? { status: "UNREAD" } : {};

  const messages = await ContactMessage.find(query)
    .sort({ status: 1, createdAt: -1 })
    .limit(limit)
    .select("sender subject message status createdAt updatedAt readAt");

  const unreadCount = await ContactMessage.countDocuments({ status: "UNREAD" });

  res.json({
    success: true,
    unreadCount,
    messages,
  });
});

export const getAdminUnreadContactCountController = asyncHandler(async (req, res) => {
  const unreadCount = await ContactMessage.countDocuments({ status: "UNREAD" });
  res.json({ success: true, unreadCount });
});

export const markAdminContactMessageReadController = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ success: false, message: "Message not found." });
  }

  if (message.status !== "READ") {
    message.status = "READ";
    message.readAt = new Date();
    message.readBy = req.user._id;
    await message.save();
  }

  res.json({ success: true, message: "Message marked as read.", contactMessage: message });
});

export const markAllAdminContactMessagesReadController = asyncHandler(async (req, res) => {
  const now = new Date();

  await ContactMessage.updateMany(
    { status: "UNREAD" },
    {
      $set: {
        status: "READ",
        readAt: now,
        readBy: req.user._id,
      },
    }
  );

  res.json({ success: true, message: "All messages marked as read.", unreadCount: 0 });
});
