import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: (process.env.CLIENT_URL || "http://localhost:5173").split(",").map(s => s.trim()),
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "AURELLE API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((error, req, res, next) => {
  console.error("API error:", error.message);
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: "Please check the submitted fields" });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "This record already exists" });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid record ID" });
  }
  res.status(error.status || 500).json({
    message: process.env.NODE_ENV === "production"
      ? "An unexpected server error occurred"
      : error.message || "Internal server error"
  });
});

const port = Number(process.env.PORT || 5000);

try {
  await connectDB();
  app.listen(port, () => console.log(`AURELLE API running at http://localhost:${port}`));
} catch (error) {
  console.error("Startup failed:", error.message);
  process.exit(1);
}
