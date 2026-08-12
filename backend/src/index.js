import "dotenv/config";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  const message =
    status === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Auth API listening on http://localhost:${port}`);
});
