const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./modules/auth/auth.routes");
const activityRoutes = require("./modules/activities/activity.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const reportRoutes = require("./modules/reports/report.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = allowedOrigins.length
  ? {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      }
    }
  : undefined;

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ message: "Academic Carbon Tracker API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
