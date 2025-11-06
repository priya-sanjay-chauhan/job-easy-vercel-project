const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser(process.env.COOKIE_SECRET));

app.set("trust proxy", 1);

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://job-easy-vercel-project-d4dg.vercel.app",
      "https://job-easy-vercel-project-d4dg.vercel.app/",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:8000",
      "http://52.66.158.80",
    ],
    credentials: true,
  })
);

// Custom Middlewares
const {
  authenticateUser,
} = require("./Middleware/UserAuthenticationMiddleware");

// Routers
const JobRouter = require("./Router/JobRouter");
const UserRouter = require("./Router/UserRouter");
const AuthRouter = require("./Router/AuthRouter");
const AdminRouter = require("./Router/AdminRouter");
const ApplicationRouter = require("./Router/ApplicationRouter");

// Test endpoint for debugging
app.get("/api/v1/test", (req, res) => {
  res.json({
    status: "Server is working",
    timestamp: new Date(),
    cookies: req.cookies,
    signedCookies: req.signedCookies,
  });
});

// Debug endpoint to check all jobs in database
app.get("/api/v1/debug/jobs", async (req, res) => {
  try {
    const JobModel = require("./Model/JobModel");
    const allJobs = await JobModel.find({}).populate(
      "createdBy",
      "username email role"
    );
    res.json({
      total: allJobs.length,
      jobs: allJobs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connecting routes
// Public routes
app.use("/api/v1/jobs", JobRouter);

// Protected routes
app.use("/api/v1/Users", authenticateUser, UserRouter);
app.use("/api/v1/Auth", AuthRouter);
app.use("/api/v1/Admin", authenticateUser, AdminRouter);
app.use("/api/v1/Application", authenticateUser, ApplicationRouter);

module.exports = app;
