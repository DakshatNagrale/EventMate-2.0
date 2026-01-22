import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // CORE AUTH INFORMATION

    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    role: {
      type: String,
      enum: [
        "MAIN_ADMIN",
        "ORGANIZER",
        "STUDENT_COORDINATOR",
        "STUDENT"
      ],
      default: "STUDENT",
      immutable: true
    },

    //COMMON PROFILE DETAILS

    mobileNumber: {
      type: String,
      match: /^[6-9]\d{9}$/,
      sparse: true
    },

    collegeName: {
      type: String,
      trim: true,
      maxlength: 150
    },

    // STUDENT SPECIFIC FIELDS

    academicProfile: {
      branch: {
        type: String,
        trim: true
      },
      year: {
        type: String,
        enum: ["1st", "2nd", "3rd"]
      }
    },

    //ORGANIZER / ADMIN FIELDS

    professionalProfile: {
      department: {
        type: String,
        trim: true
      },
      occupation: {
        type: String,
        trim: true
      }
    },

    //SYSTEM CONTROL FIELDS

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLoginAt: {
      type: Date
    },

    //AUDIT & SECURITY

    emailVerified: {
      type: Boolean,
      default: false
    },

    passwordChangedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", UserSchema);