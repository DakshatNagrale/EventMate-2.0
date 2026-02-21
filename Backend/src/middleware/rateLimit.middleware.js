import rateLimit from "express-rate-limit";

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const authWindowMs = toPositiveInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10 * 60 * 1000);
const loginMax = toPositiveInt(process.env.LOGIN_RATE_LIMIT_MAX, 10);
const registerMax = toPositiveInt(process.env.REGISTER_RATE_LIMIT_MAX, 20);

const rateLimitHandler = (message) => (req, res) => {
  const resetTime = req.rateLimit?.resetTime instanceof Date ? req.rateLimit.resetTime.getTime() : Date.now();
  const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - Date.now()) / 1000));
  res.set("Retry-After", String(retryAfterSeconds));
  return res.status(429).json({ success: false, message, retryAfterSeconds });
};

const buildLimiter = ({ max, message, skipSuccessfulRequests = false }) =>
  rateLimit({
    windowMs: authWindowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: rateLimitHandler(message),
  });

export const loginLimiter = buildLimiter({
  max: loginMax,
  message: "Too many failed login attempts, try again later",
  skipSuccessfulRequests: true,
});

export const registerLimiter = buildLimiter({
  max: registerMax,
  message: "Too many registration attempts, try again later",
});
