import { env } from "./env.js";

const defaultLocalOrigins = new Set(["http://localhost:5173", "http://127.0.0.1:5173"]);
const allowedOrigins = new Set([...env.FRONTEND_URLS, ...defaultLocalOrigins]);

const isLocalDevOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin) || isLocalDevOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
};
