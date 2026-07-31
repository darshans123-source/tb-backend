import express from "express";
import cors from "cors";
import path from "path";
import { loggerMiddleware } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Mount API routes under /api
app.use("/api", routes);

// Serve static build of frontend in production if dist exists
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.resolve(process.cwd(), "../frontend/dist");
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// Global Error Handler
app.use(errorHandler);

export default app;
