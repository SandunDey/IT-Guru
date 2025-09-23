// index.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";


// Routes
import StudentRoute from "./routes/StudentRoute.js";
import adminrouter from "./routes/AdminRoute.js";
import StaffRouter from "./routes/StaffRoute.js";
import paymentRouter from "./routes/paymentRoutes.js";
import SupportTicketRoute from "./routes/SupportTicketRoute.js";
import materialRoutes from "./routes/materialRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import cardRoute from "./routes/cardRoute.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import webhookRoutes from "./routes/webHookRoute.js";
import announcementRouter from "./routes/announcementRouter.js";
import enrollmentRouter from "./routes/enrollmentRouter.js";
import verifyJWT from "./middleware/auth.js"
import timeTableRouter from "./routes/timeTableRouter.js";
import testMarkRoutes from './routes/testMarkRoutes.js';
import FeedbackRoute from './routes/FeedbackRoute.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.DB_url || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Missing DB_url (or MONGO_URI) in .env");
  process.exit(1);
}

async function bootstrap() {
  // 1) DB
  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGO_URI, { autoIndex: true });
  console.log("✅ MongoDB connected");

  // 2) App
  const app = express();

  // If running behind a proxy (Railway/Render/NGINX), keep cookies/session flags sane
  app.set("trust proxy", 1);

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // CORS (configure via env if needed)
  const allowedOrigins = (
    process.env.CORS_ORIGINS ||
    "http://localhost:5173,http://localhost:3000,http://localhost:4000"
  )
    .split(",")
    .map((s) => s.trim());

  app.use(
    cors({
      origin: (origin, cb) =>
        !origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS")),
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  // 3) Optional sessions (only if deps installed)
  let sessionEnabled = false;
  try {
    const sessionMod = await import("express-session");
    const mongoStoreMod = await import("connect-mongo");
    const session = sessionMod.default;
    const MongoStore = mongoStoreMod.default;

    app.use(
      session({
        name: "sid",
        secret: process.env.SESSION_SECRET || "change-me",
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 2, // 2h
        },
        store: MongoStore.create({
          mongoUrl: MONGO_URI,
          ttl: 60 * 60 * 2,
        }),
      })
    );
    sessionEnabled = true;
    console.log("🟢 Sessions enabled");
  } catch (err) {
    console.warn("⚠️ Sessions disabled: install 'express-session' and 'connect-mongo' to enable them.");
  }

  // 4) Health check
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // 5) Routes (lowercase, single mount each)
  app.use("/api/student", StudentRoute);
  app.use("/api/admin", adminrouter);
  app.use("/api/staff", StaffRouter);
  app.use("/api/payment", paymentRouter);
    app.use("/api/tickets", SupportTicketRoute);
  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use("/api/materials", materialRoutes);
  app.use("/api/videos", videoRoutes);
  app.use("/api/quizzes", quizRoutes);
  app.use('/api/test', testMarkRoutes);
    app.use("/api/feedback", FeedbackRoute);
  app.use("/api/teacher", teacherRoutes);
    app.use("/api/announcements", announcementRouter);
  app.use("/api/enrollments", enrollmentRouter);
app.use("/api/card", cardRoute);
 app.get("/", (_req, res) => res.send("Timetable API OK"));//test route ekak,only prove backend server is running
  app.use("/timetable", timeTableRouter);//Connect all timetable routes under /timetable
  // 6) 404 + error handler
  app.use((req, res) => res.status(404).json({ message: "Route not found" }));
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error("❌", err);
    res.status(err.status || 500).json({ message: err.message || "Internal server error" });
  });

  // 7) Start
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}${sessionEnabled ? " (with sessions)" : ""}`);
    console.log(`   CORS allowed: ${allowedOrigins.join(", ")}`);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start app:", err);
  process.exit(1);
});
