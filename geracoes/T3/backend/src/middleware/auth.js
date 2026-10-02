import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function signToken(admin) {
  return jwt.sign({ sub: admin.id }, config.jwtSecret, { expiresIn: config.tokenTtl });
}

export function requireAuthToken(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer /, "");
  try {
    jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: "Não autorizado" });
  }
}
