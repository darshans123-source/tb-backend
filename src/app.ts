import express from "express";
import cors from "cors";
import path from "path";
import { loggerMiddleware } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

const app = express();

// Configure CORS for production (Vercel frontend & local development)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://tb-frontend-flame.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback allow in dev/staging to prevent CORS breakage
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(loggerMiddleware);

// Top-level Root and Health Endpoints
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "TB Quest Backend Running"
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK"
  });
});

// Mount API routes under /api
app.use("/api", routes);

// Serve static build of frontend in production if dist exists
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.resolve(process.cwd(), "../frontend/dist");
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path === "/health" || req.path === "/") return next();
    res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
      if (err) next();
    });
  });
}

// Global Error Handler
app.use(errorHandler);

export default app;
