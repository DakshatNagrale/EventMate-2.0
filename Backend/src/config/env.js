import dotenv from "dotenv";

dotenv.config();

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseList = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseNumber(process.env.PORT, 5000),
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
  FRONTEND_URLS: parseList(process.env.FRONTEND_URL || process.env.FRONTEND_URLS),
  EMAIL_USERNAME: process.env.EMAIL_USERNAME || "",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
};

const requiredInProduction = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];
const missingProdVars =
  env.NODE_ENV === "production"
    ? requiredInProduction.filter((key) => !env[key])
    : [];

if (missingProdVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingProdVars.join(", ")}`);
}
