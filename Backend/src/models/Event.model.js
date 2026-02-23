import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: {
      type: String,
      enum: ["Technical", "Cultural", "Sports", "Workshop"]
    },
    posterUrl: String,

    organizer: {
      organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      name: String,
      department: String,
      contactEmail: String,
      contactPhone: String
    },

    studentCoordinators: [
      {
        coordinatorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null
        },
        name: String,
        email: String
      }
    ],

    participants: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: String,
        email: String,
        status: {
          type: String,
          enum: ["REGISTERED", "CANCELLED", "ATTENDED"],
          default: "REGISTERED",
        },
        registrationType: {
          type: String,
          enum: ["INDIVIDUAL", "TEAM"],
          default: "INDIVIDUAL",
        },
        teamName: {
          type: String,
          trim: true,
          default: undefined,
        },
        headCount: {
          type: Number,
          default: 1,
        },
        participantProfile: {
          fullName: String,
          email: String,
          mobileNumber: String,
          collegeName: String,
          branch: String,
          year: String,
        },
        teamMembers: [
          {
            fullName: String,
            email: String,
            mobileNumber: String,
            collegeName: String,
            branch: String,
            year: String,
          },
        ],
        declarations: {
          studentAuthenticity: {
            type: Boolean,
            default: false,
          },
          certificateAwareness: {
            type: Boolean,
            default: false,
          },
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    venue: {
      mode: {
        type: String,
        enum: ["ONLINE", "OFFLINE", "HYBRID"]
      },
      location: String,
      googleMapLink: String
    },

    schedule: {
      startDate: Date,
      endDate: Date,
      startTime: String,
      endTime: String
    },

    registration: {
      isOpen: Boolean,
      lastDate: Date,
      maxParticipants: Number,
      participationMode: {
        type: String,
        enum: ["INDIVIDUAL", "TEAM", "BOTH"],
        default: "INDIVIDUAL",
      },
      maxTeamMembers: {
        type: Number,
        default: 4,
      },
      fee: {
        type: Number,
        default: 0
      }
    },

    attendance: {
      qrCode: String,
      totalPresent: {
        type: Number,
        default: 0
      }
    },

    certificate: {
      isEnabled: Boolean,
      templateId: {
        type: mongoose.Schema.Types.ObjectId
      },
      issuedCount: {
        type: Number,
        default: 0
      }
    },

    feedback: {
      enabled: Boolean,
      averageRating: Number
    },

    notifications: {
      sendToStudents: {
        type: Boolean,
        default: false
      }
    },

    status: {
      type: String,
      enum: ["Draft", "Published", "Completed", "Cancelled"],
      default: "Draft"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Event", EventSchema);
