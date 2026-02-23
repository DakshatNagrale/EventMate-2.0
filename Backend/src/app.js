import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { corsOptions } from "./config/cors.js";
import registerRoutes from "./routes/index.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
registerRoutes(app);

// Error Middleware
app.use(errorMiddleware);

export default app;
