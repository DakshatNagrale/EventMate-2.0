import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Add it in Backend/.env.");
  }

  await mongoose.connect(env.MONGO_URI);
  console.log("MongoDB connected");
};

export default connectDB;
