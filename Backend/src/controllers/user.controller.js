import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import ContactMessage from "../models/ContactMessage.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import generateOtp from "../utils/generateOtp.js";
import sendEmail from "../config/sendEmail.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

const COORDINATOR_STATUSES = new Set(["ACTIVE", "ON_HOLD", "SUSPENDED"]);
const CONTACT_ALLOWED_ROLES = new Set(["ORGANIZER", "STUDENT_COORDINATOR"]);

// ---------------- PROFILE ----------------
export const getProfileController = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// ---------------- UPDATE PROFILE ----------------
export const updateProfileController = asyncHandler(async (req, res) => {
  const { fullName, mobileNumber, collegeName, academicProfile, professionalProfile, coordinatorProfile } = req.body;
  const update = {};

  if (typeof fullName !== "undefined") {
    const trimmed = String(fullName || "").trim();
    if (trimmed.length < 3) {
      return res.status(400).json({ success: false, message: "Full name must be at least 3 characters." });
    }
    update.fullName = trimmed;
  }

  if (typeof mobileNumber !== "undefined") {
    const trimmedMobile = String(mobileNumber || "").trim();
    if (trimmedMobile && !/^[6-9]\d{9}$/.test(trimmedMobile)) {
      return res.status(400).json({ success: false, message: "Mobile number must be a valid 10-digit number." });
    }
    update.mobileNumber = trimmedMobile || undefined;
  }

  if (typeof collegeName !== "undefined") {
    update.collegeName = String(collegeName || "").trim() || undefined;
  }

  if (academicProfile && typeof academicProfile === "object") {
    update.academicProfile = {
      branch: String(academicProfile.branch || "").trim() || undefined,
      year: String(academicProfile.year || "").trim() || undefined,
    };
  }

  if (professionalProfile && typeof professionalProfile === "object") {
    update.professionalProfile = {
      department: String(professionalProfile.department || "").trim() || undefined,
      occupation: String(professionalProfile.occupation || "").trim() || undefined,
    };
  }

  if (req.user.role === "STUDENT_COORDINATOR" && coordinatorProfile && typeof coordinatorProfile === "object") {
    const nextStatus = String(coordinatorProfile.status || "").toUpperCase();
    if (nextStatus && !COORDINATOR_STATUSES.has(nextStatus)) {
      return res.status(400).json({ success: false, message: "Invalid coordinator status." });
    }

    update.coordinatorProfile = {
      assignedEventId: String(coordinatorProfile.assignedEventId || "").trim() || undefined,
      scope: String(coordinatorProfile.scope || "").trim() || undefined,
      status: nextStatus || undefined,
    };

    if (nextStatus) {
      update.isActive = nextStatus !== "SUSPENDED";
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, update, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, message: "Profile updated", user });
});

// ---------------- UPLOAD AVATAR ----------------
export const uploadAvatarController = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Avatar image is required." });
  }

  const result = await uploadImageCloudinary(req.file);
  req.user.avatar = result.url;
  await req.user.save();
  res.json({ success: true, message: "Avatar uploaded", avatar: result.url });
});

// ---------------- FORGOT PASSWORD ----------------
export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5*60*1000;
  await user.save();

  await sendEmail(email, "Reset Password OTP", forgotPasswordTemplate({ name: user.fullName, otp }));
  res.json({ success: true, message: "OTP sent to email" });
});

// ---------------- RESET PASSWORD ----------------
export const resetPasswordController = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "Email, OTP, and new password are required" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
  }

  const user = await User.findOne({ email }).select("+otp +otpExpiry");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  if (user.otp !== otp || user.otpExpiry < Date.now())
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});

// ---------------- CONTACT ADMIN ----------------
export const contactAdminController = asyncHandler(async (req, res) => {
  if (!CONTACT_ALLOWED_ROLES.has(req.user.role)) {
    return res.status(403).json({ success: false, message: "Only organizers and coordinators can contact admin here." });
  }

  const subject = String(req.body.subject || "").trim();
  const message = String(req.body.message || "").trim();

  if (subject.length < 3) {
    return res.status(400).json({ success: false, message: "Subject must be at least 3 characters." });
  }

  if (message.length < 10) {
    return res.status(400).json({ success: false, message: "Message must be at least 10 characters." });
  }

  const contactMessage = await ContactMessage.create({
    sender: {
      userId: req.user._id,
      name: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar || null,
    },
    subject,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Message sent to admin successfully.",
    contactMessage,
  });
});

export const getMyContactMessagesController = asyncHandler(async (req, res) => {
  if (!CONTACT_ALLOWED_ROLES.has(req.user.role)) {
    return res.status(403).json({ success: false, message: "Only organizers and coordinators can access these messages." });
  }

  const messages = await ContactMessage.find({ "sender.userId": req.user._id })
    .sort({ createdAt: -1 })
    .limit(30)
    .select("subject message status createdAt updatedAt readAt");

  res.json({ success: true, messages });
});
