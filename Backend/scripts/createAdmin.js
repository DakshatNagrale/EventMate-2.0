import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/User.model.js";

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existingAdmin = await User.findOne({ role: "ADMIN" });
  if (existingAdmin) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await User.create({
    fullName: "Main Admin",
    email: "admin@eventmate.com",
    password: hashedPassword,
    role: "MAIN_ADMIN",
    emailVerified: true
  });

  console.log("Admin created successfully");
  process.exit();
};

createAdmin();