import cors from "cors";
import express from "express";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { publicRouter } from "./routes/public.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api", publicRouter);

app.use((err, req, res, next) => {
  if (err.code === 11000) return res.status(409).json({ error: "Slug já está em uso" });
  if (err.name === "ValidationError") {
    const messages = [...new Set(Object.values(err.errors).map((e) => e.message))];
    return res.status(400).json({ error: messages.join("; ") });
  }
  console.error(err);
  res.status(500).json({ error: "Erro interno" });
});
