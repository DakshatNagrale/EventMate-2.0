import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";
import Event from "../models/Event.model.js";
import User from "../models/User.model.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const VALID_EVENT_STATUSES = new Set(["Draft", "Published", "Completed", "Cancelled"]);
const VALID_EVENT_CATEGORIES = new Set(["Technical", "Cultural", "Sports", "Workshop"]);
const COORDINATOR_STATUSES = new Set(["ACTIVE", "ON_HOLD", "SUSPENDED"]);
const REGISTRATION_ACTIVE_STATUSES = new Set(["REGISTERED", "ATTENDED"]);
const VALID_PARTICIPATION_MODES = new Set(["INDIVIDUAL", "TEAM", "BOTH"]);
const VALID_REGISTRATION_TYPES = new Set(["INDIVIDUAL", "TEAM"]);

const parseJsonPayload = (value, fallback = null) => {
  if (typeof value === "undefined" || value === null || value === "") return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error("Invalid JSON payload.");
    }
  }
  if (typeof value === "object") return value;
  return fallback;
};

const normalizeDate = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
};

const normalizeText = (value) => String(value || "").trim();
const normalizeEmail = (value) => normalizeText(value).toLowerCase();
const isTruthy = (value) => value === true || value === "true";

const sanitizeStudentCoordinators = (raw) => {
  if (!Array.isArray(raw)) return [];

  return raw
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
    .filter((item) => item.name || item.email || item.coordinatorId);
};

const sanitizeEventPayload = ({
  title,
  description,
  category,
  venue,
  schedule,
  registration,
  certificate,
  feedback,
  studentCoordinators,
  sendNotification,
  status,
}) => {
  const normalizedStatus = typeof status === "undefined" ? undefined : String(status || "").trim();
  const resolvedStatus = VALID_EVENT_STATUSES.has(normalizedStatus) ? normalizedStatus : "Draft";

  const parsedVenue = parseJsonPayload(venue, undefined);
  const parsedSchedule = parseJsonPayload(schedule, undefined);
  const parsedRegistration = parseJsonPayload(registration, { isOpen: false, fee: 0 });
  const parsedCertificate = parseJsonPayload(certificate, { isEnabled: false });
  const parsedFeedback = parseJsonPayload(feedback, { enabled: false });
  const parsedStudentCoordinators = parseJsonPayload(studentCoordinators, []);

  const sanitizedVenue =
    parsedVenue && typeof parsedVenue === "object"
      ? {
          mode: String(parsedVenue.mode || "OFFLINE").toUpperCase(),
          location: String(parsedVenue.location || "").trim() || undefined,
          googleMapLink: String(parsedVenue.googleMapLink || "").trim() || undefined,
        }
      : undefined;

  const sanitizedSchedule =
    parsedSchedule && typeof parsedSchedule === "object"
      ? {
          startDate: normalizeDate(parsedSchedule.startDate),
          endDate: normalizeDate(parsedSchedule.endDate),
          startTime: String(parsedSchedule.startTime || "").trim() || undefined,
          endTime: String(parsedSchedule.endTime || "").trim() || undefined,
        }
      : undefined;

  const maxParticipantsRaw =
    typeof parsedRegistration?.maxParticipants === "undefined"
      ? undefined
      : Number(parsedRegistration.maxParticipants);
  const feeRaw = Number(parsedRegistration?.fee || 0);
  const participationModeRaw = String(parsedRegistration?.participationMode || "INDIVIDUAL").toUpperCase();
  const maxTeamMembersRaw = Number(parsedRegistration?.maxTeamMembers);
  const resolvedParticipationMode = VALID_PARTICIPATION_MODES.has(participationModeRaw)
    ? participationModeRaw
    : "INDIVIDUAL";

  const sanitizedRegistration =
    parsedRegistration && typeof parsedRegistration === "object"
      ? {
          isOpen: Boolean(parsedRegistration.isOpen),
          lastDate: normalizeDate(parsedRegistration.lastDate),
          maxParticipants:
            Number.isFinite(maxParticipantsRaw) && maxParticipantsRaw > 0
              ? Math.floor(maxParticipantsRaw)
              : undefined,
          participationMode: resolvedParticipationMode,
          maxTeamMembers:
            resolvedParticipationMode === "INDIVIDUAL"
              ? undefined
              : Number.isFinite(maxTeamMembersRaw) && maxTeamMembersRaw >= 2
                ? Math.floor(maxTeamMembersRaw)
                : 4,
          fee: Number.isFinite(feeRaw) && feeRaw >= 0 ? feeRaw : 0,
        }
      : { isOpen: false, fee: 0, participationMode: "INDIVIDUAL" };

  const sanitizedCertificate =
    parsedCertificate && typeof parsedCertificate === "object"
      ? {
          isEnabled: Boolean(parsedCertificate.isEnabled),
          templateId: parsedCertificate.templateId || undefined,
        }
      : { isEnabled: false };

  const sanitizedFeedback =
    parsedFeedback && typeof parsedFeedback === "object"
      ? {
          enabled: Boolean(parsedFeedback.enabled),
          averageRating:
            typeof parsedFeedback.averageRating === "number" ? parsedFeedback.averageRating : undefined,
        }
      : { enabled: false };

  return {
    title: typeof title === "undefined" ? undefined : String(title || "").trim(),
    description: typeof description === "undefined" ? undefined : String(description || "").trim(),
    category: typeof category === "undefined" ? undefined : String(category || "").trim(),
    venue: sanitizedVenue,
    schedule: sanitizedSchedule,
    registration: sanitizedRegistration,
    certificate: sanitizedCertificate,
    feedback: sanitizedFeedback,
    studentCoordinators: sanitizeStudentCoordinators(parsedStudentCoordinators),
    sendNotification: sendNotification === "true" || sendNotification === true,
    status: resolvedStatus,
  };
};

const countActiveParticipants = (participants = []) =>
  participants.reduce((sum, item) => {
    if (!REGISTRATION_ACTIVE_STATUSES.has(item?.status)) return sum;
    const headCountRaw = Number(item?.headCount || 1);
    const headCount = Number.isFinite(headCountRaw) && headCountRaw > 0 ? Math.floor(headCountRaw) : 1;
    return sum + headCount;
  }, 0);

const sanitizeCoordinator = (coordinator) => {
  const profile = coordinator?.coordinatorProfile || {};
  const resolvedStatus = profile.status || (coordinator?.isActive ? "ACTIVE" : "SUSPENDED");

  return {
    _id: coordinator?._id,
    fullName: coordinator?.fullName || "",
    email: coordinator?.email || "",
    mobileNumber: coordinator?.mobileNumber || "",
    scope: profile.scope || coordinator?.professionalProfile?.department || "",
    assignedEventId: profile.assignedEventId || "",
    status: resolvedStatus,
    isActive: Boolean(coordinator?.isActive),
    lastLoginAt: coordinator?.lastLoginAt || null,
    createdAt: coordinator?.createdAt,
    updatedAt: coordinator?.updatedAt,
  };
};

const canOrganizerAccessCoordinator = async (coordinatorId, organizerId) => {
  const assignmentExists = await Event.exists({
    "organizer.organizerId": organizerId,
    "studentCoordinators.coordinatorId": coordinatorId,
  });
  return Boolean(assignmentExists);
};

const sanitizeParticipantProfile = (raw = {}, fallback = {}) => ({
  fullName: normalizeText(raw.fullName || fallback.fullName),
  email: normalizeEmail(raw.email || fallback.email),
  mobileNumber: normalizeText(raw.mobileNumber || fallback.mobileNumber),
  collegeName: normalizeText(raw.collegeName || fallback.collegeName),
  branch: normalizeText(raw.branch || fallback.branch),
  year: normalizeText(raw.year || fallback.year),
});

const validateParticipantProfile = (profile, label = "Participant") => {
  if (!profile.fullName || profile.fullName.length < 3) {
    return `${label} full name must be at least 3 characters.`;
  }
  if (!profile.email || !validator.isEmail(profile.email)) {
    return `${label} email must be a valid email address.`;
  }
  if (!profile.mobileNumber || !/^[6-9]\d{9}$/.test(profile.mobileNumber)) {
    return `${label} mobile number must be a valid 10-digit number.`;
  }
  if (!profile.collegeName) {
    return `${label} college name is required.`;
  }
  if (!profile.branch) {
    return `${label} branch is required.`;
  }
  if (!profile.year) {
    return `${label} year is required.`;
  }
  return null;
};

export const createEventController = asyncHandler(async (req, res) => {
  const hasStatusInput = typeof req.body?.status !== "undefined";
  if (hasStatusInput && !VALID_EVENT_STATUSES.has(String(req.body.status || "").trim())) {
    return res.status(400).json({
      success: false,
      message: "Invalid event status.",
    });
  }

  let payload;
  try {
    payload = sanitizeEventPayload(req.body || {});
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid structured event payload.",
    });
  }

  if (!payload.title || !payload.category) {
    return res.status(400).json({
      success: false,
      message: "Title and category are required",
    });
  }

  if (!VALID_EVENT_CATEGORIES.has(payload.category)) {
    return res.status(400).json({
      success: false,
      message: "Invalid event category.",
    });
  }

  if (!req.file && payload.status === "Published") {
    return res.status(400).json({
      success: false,
      message: "Event banner is required to publish.",
    });
  }

  let posterUrl = "";
  if (req.file) {
    const uploaded = await uploadImageCloudinary(req.file);
    posterUrl = uploaded.url;
  }

  const event = await Event.create({
    title: payload.title,
    description: payload.description,
    category: payload.category,
    posterUrl,
    organizer: {
      organizerId: req.user._id,
      name: req.user.fullName,
      department: req.user.professionalProfile?.department || "",
      contactEmail: req.user.email,
      contactPhone: req.user.mobileNumber || "",
    },
    venue: payload.venue,
    schedule: payload.schedule,
    registration: payload.registration,
    certificate: payload.certificate,
    feedback: payload.feedback,
    studentCoordinators: payload.studentCoordinators,
    notifications: {
      sendToStudents: payload.sendNotification,
    },
    status: payload.status,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: payload.status === "Published" ? "Event published successfully." : "Event saved as draft successfully.",
    data: event,
  });
});

export const updateEventController = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, message: "Invalid event id." });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found." });
  }

  const isAdmin = req.user.role === "MAIN_ADMIN";
  const isOwner = String(event.organizer?.organizerId || "") === String(req.user._id);
  if (!isAdmin && !isOwner) {
    return res.status(403).json({ success: false, message: "You can edit only your own events." });
  }

  const hasStatusInput = typeof req.body?.status !== "undefined";
  if (hasStatusInput && !VALID_EVENT_STATUSES.has(String(req.body.status || "").trim())) {
    return res.status(400).json({ success: false, message: "Invalid event status." });
  }

  let payload;
  try {
    payload = sanitizeEventPayload(req.body || {});
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid structured event payload.",
    });
  }

  if (typeof payload.title !== "undefined") {
    if (!payload.title) {
      return res.status(400).json({ success: false, message: "Title cannot be empty." });
    }
    event.title = payload.title;
  }

  if (typeof payload.description !== "undefined") {
    event.description = payload.description;
  }

  if (typeof payload.category !== "undefined") {
    if (!VALID_EVENT_CATEGORIES.has(payload.category)) {
      return res.status(400).json({ success: false, message: "Invalid event category." });
    }
    event.category = payload.category;
  }

  if (typeof req.body.venue !== "undefined") {
    event.venue = payload.venue;
  }

  if (typeof req.body.schedule !== "undefined") {
    event.schedule = payload.schedule;
  }

  if (typeof req.body.registration !== "undefined") {
    event.registration = payload.registration;
  }

  if (typeof req.body.certificate !== "undefined") {
    event.certificate = payload.certificate;
  }

  if (typeof req.body.feedback !== "undefined") {
    event.feedback = payload.feedback;
  }

  if (typeof req.body.studentCoordinators !== "undefined") {
    event.studentCoordinators = payload.studentCoordinators;
  }

  if (typeof req.body.sendNotification !== "undefined") {
    event.notifications = {
      ...(event.notifications || {}),
      sendToStudents: payload.sendNotification,
    };
  }

  if (typeof req.body.status !== "undefined") {
    event.status = payload.status;
  }

  if (req.file) {
    const uploaded = await uploadImageCloudinary(req.file);
    event.posterUrl = uploaded.url;
  }

  if (event.status === "Published" && !event.posterUrl) {
    return res.status(400).json({
      success: false,
      message: "Event banner is required to publish.",
    });
  }

  event.updatedBy = req.user._id;
  await event.save();

  res.json({
    success: true,
    message: "Event updated successfully.",
    event,
  });
});

export const getMyEventsController = asyncHandler(async (req, res) => {
  const role = req.user?.role;
  const query = role === "MAIN_ADMIN" ? {} : { "organizer.organizerId": req.user._id };

  const events = await Event.find(query)
    .sort({ createdAt: -1 })
    .select(
      "title description category status posterUrl venue schedule registration createdAt updatedAt organizer studentCoordinators participants"
    );

  const responseEvents = events.map((item) => {
    const event = item.toObject();
    event.participantCount = countActiveParticipants(event.participants || []);
    delete event.participants;
    return event;
  });

  res.json({ success: true, events: responseEvents });
});

export const getPublicEventsController = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: "Published" })
    .sort({ "schedule.startDate": 1, createdAt: -1 })
    .select(
      "title description category posterUrl venue schedule registration status createdAt updatedAt organizer studentCoordinators participants"
    );

  const responseEvents = events.map((item) => {
    const event = item.toObject();
    event.participantCount = countActiveParticipants(event.participants || []);
    delete event.participants;
    return event;
  });

  res.json({ success: true, events: responseEvents });
});

export const getPublicEventDetailsController = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, message: "Invalid event id." });
  }

  const event = await Event.findOne({ _id: eventId, status: "Published" }).select(
    "title description category posterUrl venue schedule registration status organizer studentCoordinators certificate feedback notifications participants createdAt updatedAt"
  );

  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found." });
  }

  const responseEvent = event.toObject();
  responseEvent.participantCount = countActiveParticipants(responseEvent.participants || []);
  delete responseEvent.participants;

  res.json({ success: true, event: responseEvent });
});

export const registerForEventController = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, message: "Invalid event id." });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found." });
  }

  if (event.status !== "Published") {
    return res.status(400).json({ success: false, message: "Registration is allowed only for published events." });
  }

  if (event.registration?.isOpen === false) {
    return res.status(400).json({ success: false, message: "Registration is currently closed for this event." });
  }

  if (event.registration?.lastDate) {
    const now = new Date();
    if (now > new Date(event.registration.lastDate)) {
      return res.status(400).json({ success: false, message: "Registration deadline has passed." });
    }
  }

  const alreadyRegistered = (event.participants || []).some(
    (item) =>
      String(item.studentId || "") === String(req.user._id) && REGISTRATION_ACTIVE_STATUSES.has(item.status || "")
  );

  if (alreadyRegistered) {
    return res.status(409).json({ success: false, message: "You are already registered for this event." });
  }

  const participationModeRaw = String(event.registration?.participationMode || "INDIVIDUAL").toUpperCase();
  const participationMode = VALID_PARTICIPATION_MODES.has(participationModeRaw)
    ? participationModeRaw
    : "INDIVIDUAL";

  const requestedRegistrationType = String(req.body?.registrationType || "").toUpperCase();
  const registrationType = VALID_REGISTRATION_TYPES.has(requestedRegistrationType)
    ? requestedRegistrationType
    : participationMode === "TEAM"
      ? "TEAM"
      : "INDIVIDUAL";

  if (participationMode === "INDIVIDUAL" && registrationType !== "INDIVIDUAL") {
    return res.status(400).json({ success: false, message: "This event allows individual registrations only." });
  }

  if (participationMode === "TEAM" && registrationType !== "TEAM") {
    return res.status(400).json({ success: false, message: "This event allows team registrations only." });
  }

  const declarations = {
    studentAuthenticity: isTruthy(req.body?.declarations?.studentAuthenticity),
    certificateAwareness: isTruthy(req.body?.declarations?.certificateAwareness),
  };

  if (!declarations.studentAuthenticity || !declarations.certificateAwareness) {
    return res.status(400).json({
      success: false,
      message: "Please accept all declarations before submitting registration.",
    });
  }

  const participantProfile = sanitizeParticipantProfile(req.body?.participantProfile, {
    fullName: req.user.fullName,
    email: req.user.email,
    mobileNumber: req.user.mobileNumber || "",
    collegeName: req.user.collegeName || "",
    branch: req.user.academicProfile?.branch || "",
    year: req.user.academicProfile?.year || "",
  });

  const participantValidationError = validateParticipantProfile(
    participantProfile,
    registrationType === "TEAM" ? "Team leader" : "Participant"
  );
  if (participantValidationError) {
    return res.status(400).json({ success: false, message: participantValidationError });
  }

  let teamName = "";
  let teamMembers = [];
  let headCount = 1;

  if (registrationType === "TEAM") {
    teamName = normalizeText(req.body?.teamName);
    if (teamName.length < 2) {
      return res.status(400).json({ success: false, message: "Team name is required for team registration." });
    }

    const rawTeamMembers = Array.isArray(req.body?.teamMembers) ? req.body.teamMembers : [];
    const maxTeamMembersRaw = Number(event.registration?.maxTeamMembers || 4);
    const maxTeamMembers =
      Number.isFinite(maxTeamMembersRaw) && maxTeamMembersRaw >= 2 ? Math.floor(maxTeamMembersRaw) : 4;
    const maxAdditionalMembers = Math.max(maxTeamMembers - 1, 1);

    if (rawTeamMembers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Add at least one team member for team registration.",
      });
    }

    if (rawTeamMembers.length > maxAdditionalMembers) {
      return res.status(400).json({
        success: false,
        message: `A maximum of ${maxAdditionalMembers} additional team members is allowed for this event.`,
      });
    }

    teamMembers = rawTeamMembers.map((member) => sanitizeParticipantProfile(member));

    for (let index = 0; index < teamMembers.length; index += 1) {
      const memberError = validateParticipantProfile(teamMembers[index], `Team member ${index + 1}`);
      if (memberError) {
        return res.status(400).json({ success: false, message: memberError });
      }
    }

    const emailSet = new Set([participantProfile.email]);
    for (const member of teamMembers) {
      if (emailSet.has(member.email)) {
        return res.status(400).json({
          success: false,
          message: "Team member emails must be unique and different from team leader email.",
        });
      }
      emailSet.add(member.email);
    }

    headCount = 1 + teamMembers.length;
  }

  const maxParticipants = Number(event.registration?.maxParticipants || 0);
  const currentRegisteredCount = countActiveParticipants(event.participants || []);
  if (maxParticipants > 0 && currentRegisteredCount + headCount > maxParticipants) {
    return res.status(400).json({ success: false, message: "Registration is full for this event." });
  }

  event.participants = event.participants || [];
  event.participants.push({
    studentId: req.user._id,
    name: participantProfile.fullName,
    email: participantProfile.email,
    status: "REGISTERED",
    registrationType,
    teamName: registrationType === "TEAM" ? teamName : undefined,
    headCount,
    participantProfile,
    teamMembers: registrationType === "TEAM" ? teamMembers : [],
    declarations,
    registeredAt: new Date(),
  });
  event.updatedBy = req.user._id;
  await event.save();

  res.status(201).json({
    success: true,
    message: registrationType === "TEAM" ? "Team registered successfully." : "Registered successfully.",
    registration: {
      eventId: event._id,
      studentId: req.user._id,
      status: "REGISTERED",
      registrationType,
      teamName: registrationType === "TEAM" ? teamName : undefined,
      headCount,
    },
  });
});

export const getMyRegisteredEventsController = asyncHandler(async (req, res) => {
  const events = await Event.find({ "participants.studentId": req.user._id })
    .sort({ "schedule.startDate": 1, createdAt: -1 })
    .select(
      "title description category posterUrl venue schedule registration status organizer studentCoordinators participants createdAt updatedAt"
    );

  const responseEvents = events.map((item) => {
    const event = item.toObject();
    const registration = (event.participants || []).find(
      (participant) => String(participant.studentId || "") === String(req.user._id)
    );
    event.myRegistration = registration
      ? {
          status: registration.status,
          registeredAt: registration.registeredAt,
          registrationType: registration.registrationType || "INDIVIDUAL",
          teamName: registration.teamName || "",
          headCount:
            Number.isFinite(Number(registration.headCount)) && Number(registration.headCount) > 0
              ? Number(registration.headCount)
              : 1,
        }
      : null;
    event.participantCount = countActiveParticipants(event.participants || []);
    delete event.participants;
    return event;
  });

  res.json({ success: true, events: responseEvents });
});

export const getAvailableCoordinatorsController = asyncHandler(async (req, res) => {
  const coordinators = await User.find({ role: "STUDENT_COORDINATOR", isActive: true })
    .sort({ fullName: 1 })
    .select("fullName email coordinatorProfile mobileNumber isActive lastLoginAt createdAt updatedAt");

  res.json({
    success: true,
    coordinators: coordinators.map((coordinator) => sanitizeCoordinator(coordinator)),
  });
});

export const createEventCoordinatorController = asyncHandler(async (req, res) => {
  const { fullName, email, password, mobileNumber, scope, assignedEventId, status } = req.body || {};

  if (!fullName || String(fullName).trim().length < 3) {
    return res.status(400).json({ success: false, message: "Full name must be at least 3 characters." });
  }

  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !validator.isEmail(normalizedEmail)) {
    return res.status(400).json({ success: false, message: "Valid email is required." });
  }

  if (!password || String(password).length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
  }

  const trimmedMobile = String(mobileNumber || "").trim();
  if (trimmedMobile && !/^[6-9]\d{9}$/.test(trimmedMobile)) {
    return res.status(400).json({ success: false, message: "Mobile number must be a valid 10-digit number." });
  }

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
    mobileNumber: trimmedMobile || undefined,
    professionalProfile: {
      department: String(scope || "").trim(),
      occupation: "Student Coordinator",
    },
    coordinatorProfile: {
      assignedEventId: String(assignedEventId || "").trim(),
      scope: String(scope || "").trim(),
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

export const updateEventCoordinatorController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid coordinator id." });
  }

  const coordinator = await User.findOne({ _id: id, role: "STUDENT_COORDINATOR" });
  if (!coordinator) {
    return res.status(404).json({ success: false, message: "Coordinator not found." });
  }

  if (req.user.role === "ORGANIZER") {
    const isCreator = String(coordinator.createdBy || "") === String(req.user._id);
    const hasAssignment = await canOrganizerAccessCoordinator(coordinator._id, req.user._id);
    if (!isCreator && !hasAssignment) {
      return res.status(403).json({ success: false, message: "You can manage only your coordinators." });
    }
  }

  const { fullName, mobileNumber, scope, assignedEventId, status, isActive } = req.body || {};

  if (typeof fullName !== "undefined") {
    const trimmed = String(fullName || "").trim();
    if (trimmed.length < 3) {
      return res.status(400).json({ success: false, message: "Full name must be at least 3 characters." });
    }
    coordinator.fullName = trimmed;
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
    scope: typeof scope !== "undefined" ? String(scope || "").trim() : coordinator.coordinatorProfile?.scope || "",
    status: coordinator.coordinatorProfile?.status || "ACTIVE",
  };

  if (typeof scope !== "undefined") {
    coordinator.professionalProfile = {
      ...(coordinator.professionalProfile || {}),
      department: String(scope || "").trim() || undefined,
      occupation: coordinator.professionalProfile?.occupation || "Student Coordinator",
    };
  }

  if (typeof status !== "undefined") {
    const nextStatus = String(status || "").toUpperCase();
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

export const getOrganizerCoordinatorActivityController = asyncHandler(async (req, res) => {
  const events = await Event.find({ "organizer.organizerId": req.user._id })
    .sort({ updatedAt: -1 })
    .select("title status updatedAt createdAt studentCoordinators")
    .lean();

  const activityMap = new Map();

  for (const event of events) {
    for (const coordinator of event.studentCoordinators || []) {
      const coordinatorId = coordinator?.coordinatorId ? String(coordinator.coordinatorId) : "";
      const email = String(coordinator?.email || "").trim().toLowerCase();
      const name = String(coordinator?.name || "").trim();
      const key = coordinatorId || (email ? `email:${email}` : "");
      if (!key) continue;

      if (!activityMap.has(key)) {
        activityMap.set(key, {
          coordinatorId: coordinatorId || null,
          fullName: name || "Coordinator",
          email,
          scope: "",
          assignedEventId: "",
          status: "UNKNOWN",
          isActive: true,
          mobileNumber: "",
          assignedEvents: [],
        });
      }

      const record = activityMap.get(key);
      record.assignedEvents.push({
        eventId: String(event._id),
        title: event.title || "Untitled Event",
        status: event.status || "Draft",
        updatedAt: event.updatedAt || event.createdAt || null,
      });
      if (!record.fullName && name) record.fullName = name;
      if (!record.email && email) record.email = email;
    }
  }

  const coordinatorIds = Array.from(activityMap.values())
    .map((item) => item.coordinatorId)
    .filter(Boolean);

  const coordinators = coordinatorIds.length
    ? await User.find({ _id: { $in: coordinatorIds }, role: "STUDENT_COORDINATOR" }).select(
        "fullName email mobileNumber coordinatorProfile isActive lastLoginAt createdAt updatedAt"
      )
    : [];

  for (const coordinator of coordinators) {
    const key = String(coordinator._id);
    if (!activityMap.has(key)) continue;
    const existing = activityMap.get(key);
    const profile = coordinator.coordinatorProfile || {};

    existing.fullName = coordinator.fullName || existing.fullName;
    existing.email = coordinator.email || existing.email;
    existing.mobileNumber = coordinator.mobileNumber || "";
    existing.scope = profile.scope || "";
    existing.assignedEventId = profile.assignedEventId || "";
    existing.status = profile.status || (coordinator.isActive ? "ACTIVE" : "SUSPENDED");
    existing.isActive = coordinator.isActive;
    existing.lastLoginAt = coordinator.lastLoginAt || null;
  }

  const coordinatorActivity = Array.from(activityMap.values()).map((item) => {
    const sortedAssignments = [...item.assignedEvents].sort(
      (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );

    const draftCount = sortedAssignments.filter((event) => event.status === "Draft").length;
    const publishedCount = sortedAssignments.filter((event) => event.status === "Published").length;
    const completedCount = sortedAssignments.filter((event) => event.status === "Completed").length;
    const cancelledCount = sortedAssignments.filter((event) => event.status === "Cancelled").length;

    return {
      coordinatorId: item.coordinatorId,
      fullName: item.fullName || "Coordinator",
      email: item.email || "",
      mobileNumber: item.mobileNumber || "",
      scope: item.scope || "",
      assignedEventId: item.assignedEventId || "",
      status: item.status || "UNKNOWN",
      isActive: Boolean(item.isActive),
      lastLoginAt: item.lastLoginAt || null,
      assignedEventsCount: sortedAssignments.length,
      draftCount,
      publishedCount,
      completedCount,
      cancelledCount,
      lastActivityAt: sortedAssignments[0]?.updatedAt || null,
      recentAssignments: sortedAssignments.slice(0, 3),
    };
  });

  coordinatorActivity.sort((a, b) => {
    const aTime = new Date(a.lastActivityAt || 0).getTime();
    const bTime = new Date(b.lastActivityAt || 0).getTime();
    if (aTime !== bTime) return bTime - aTime;
    return String(a.fullName || "").localeCompare(String(b.fullName || ""));
  });

  const summary = {
    totalCoordinators: coordinatorActivity.length,
    activeCoordinators: coordinatorActivity.filter((item) => item.isActive).length,
    totalAssignments: coordinatorActivity.reduce((sum, item) => sum + item.assignedEventsCount, 0),
    publishedAssignments: coordinatorActivity.reduce((sum, item) => sum + item.publishedCount, 0),
  };

  res.json({
    success: true,
    summary,
    coordinators: coordinatorActivity,
  });
});
