import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import captionsRouter from "./routes/captions";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

// Enable CORS for all routes
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/captions", captionsRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("Health check endpoint hit");
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
