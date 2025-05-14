import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import captionsRouter from "./routes/captions";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/captions", captionsRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("Health check endpoint hit");
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
