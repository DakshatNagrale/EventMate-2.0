import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

export const createStudentCoordinator = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const coordinator = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "STUDENT_COORDINATOR"
    });

    res.status(201).json({
      message: "Student Coordinator created successfully",
      coordinator: {
        id: coordinator._id,
        fullName: coordinator.fullName,
        email: coordinator.email,
        role: coordinator.role
      }
    });

  } catch (error) {
    console.log("Create coordinator error:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};