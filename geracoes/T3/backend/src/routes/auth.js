import { Router } from "express";
import { Admin } from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const admin = await Admin.findOne({ email: String(email || "").trim().toLowerCase() });
  if (!admin || !admin.checkPassword(String(password || ""))) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
  res.json({ token: signToken(admin) });
}));
