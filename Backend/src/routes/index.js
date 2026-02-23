import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import adminRoutes from "./admin.routes.js";
import eventRoutes from "./event.routes.js";

const registerRoutes = (app) => {
  app.get("/api/health", (req, res) => {
    res.json({ success: true, status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/events", eventRoutes);

  app.get("/", (req, res) => {
    res.json({ success: true, message: "EventMate Backend Running" });
  });
};

export default registerRoutes;
