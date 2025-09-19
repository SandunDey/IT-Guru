// index.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

// Your routes
import StudentRoute from "./routes/StudentRoute.js";
import adminrouter from "./routes/AdminRoute.js";
import StaffRouter from "./routes/StaffRoute.js";
import router from "./routes/paymentRoutes.js";
import SupportTicketRoute from "./routes/SupportTicketRoute.js";//supportTicket(Vishwa)
import announcementRouter from "./routes/announcementRouter.js";
import enrollmentRouter from "./routes/enrollmentRouter.js";
import verifyJWT from "./middleware/auth.js"



dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DB_url || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Missing DB_url (or MONGO_URI) in .env");
  process.exit(1);
}

async function bootstrap() {
  // 1) Connect DB
  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGO_URI, { autoIndex: true });
  console.log("✅ MongoDB connected");

  // 2) Build app
  const app = express();

  app.use(helmet());
  app.use(verifyJWT);
  app.use(
    cors({
      origin: [
        "http://localhost:5173", // Vite
        "http://localhost:3000", // if you sometimes open frontend here
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );


  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  // 3) Try to enable sessions if deps are present; otherwise continue without them
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
    console.warn(
      "⚠️ Sessions disabled: install 'express-session' and 'connect-mongo' to enable them."
    );
  }

  // 4) Routes (keeping your original paths)
  app.use("/api/Student", StudentRoute);
  app.use("/api/Admin", adminrouter);
  app.use("/api/Staff", StaffRouter);
  app.use("/api/payment", router);
  app.use("/api/tickets", SupportTicketRoute);//supportTicket(Vishwa)
  app.use("/api/tickets", SupportTicketRoute);//supportTicket(Vishwa)
  app.use("/api/announcements", announcementRouter);
  app.use("/api/enrollments", enrollmentRouter);


  // 5) 404 + error handler
  app.use((req, res) => res.status(404).json({ message: "Route not found" }));
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error("❌", err);
    res.status(err.status || 500).json({ message: err.message || "Internal server error" });
  });

  // 6) Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}${sessionEnabled ? " (with sessions)" : ""}`);
  });
}

bootstrap().catch(err => {
  console.error("❌ Failed to start app:", err);
  process.exit(1);
});
