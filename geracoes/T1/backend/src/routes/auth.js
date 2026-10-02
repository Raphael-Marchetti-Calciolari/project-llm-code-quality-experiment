import { Router } from "express";
import { Admin } from "../models/Admin.js";
import { signToken } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const admin = await Admin.findOne({ email: String(email || "").toLowerCase() });
  if (!admin || !admin.checkPassword(String(password || ""))) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
  res.json({ token: signToken(admin) });
});
