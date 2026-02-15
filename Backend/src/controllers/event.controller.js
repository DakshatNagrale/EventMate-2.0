import Event from "../models/Event.model.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const createEventController = asyncHandler(async (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Event poster is required"
    });
  }

  const {
    title,
    description,
    category,
    venue,
    schedule,
    registration,
    certificate,
    feedback
  } = req.body;

  if (!title || !category) {
    return res.status(400).json({
      success: false,
      message: "Title and category are required"
    });
  }

  // Upload to Cloudinary
  const uploaded = await uploadImageCloudinary(req.file);

  const event = await Event.create({
    title,
    description,
    category,
    posterUrl: uploaded.url,

    organizer: {
      organizerId: req.user._id,
      name: req.user.fullName,
      department: req.user.professionalProfile?.department || "",
      contactEmail: req.user.email,
      contactPhone: req.user.mobileNumber || ""
    },

    venue: venue ? JSON.parse(venue) : undefined,
    schedule: schedule ? JSON.parse(schedule) : undefined,
    registration: registration ? JSON.parse(registration) : {
      isOpen: false,
      fee: 0
    },
    certificate: certificate ? JSON.parse(certificate) : { isEnabled: false },
    feedback: feedback ? JSON.parse(feedback) : { enabled: false },

    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Event created successfully (Draft)",
    data: event
  });
});