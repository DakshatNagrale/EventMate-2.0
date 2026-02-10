import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  _id: ObjectId,
  title: String,
  description: String,
  category: String,            // Technical, Cultural, Sports, Workshop
  posterUrl: String,

  organizer: {
    organizerId: ObjectId,
    name: String,
    department: String,
    contactEmail: String,
    contactPhone: String
  },

  venue: {
    mode: String,              // Online / Offline / Hybrid
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
    fee: Number
  },

  attendance: {
    qrCode: String,
    totalPresent: Number
  },

  certificate: {
    isEnabled: Boolean,
    templateId: ObjectId,
    issuedCount: Number
  },

  feedback: {
    enabled: Boolean,
    averageRating: Number
  },

  status: String,              // Draft, Published, Completed, Cancelled
  createdAt: Date,
  updatedAt: Date
});

export default mongoose.model("Event", EventSchema);