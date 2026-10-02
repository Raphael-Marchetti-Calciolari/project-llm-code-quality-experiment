import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Compara duas strings em tempo constante para evitar timing attacks.
 */
function safeEqual(a, b) {
  const bufferA = Buffer.from(String(a));
  const bufferB = Buffer.from(String(b));
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufferA, bufferB);
}

/**
 * POST /api/auth/login
 * Autentica o único administrador da loja a partir das credenciais
 * definidas nas variáveis de ambiente e devolve um token JWT.
 */
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};

  const validUser = safeEqual(username, config.admin.username);
  const validPass = safeEqual(password, config.admin.password);

  if (!validUser || !validPass) {
    throw new ApiError(401, 'Usuário ou senha inválidos.');
  }

  const token = jwt.sign({ sub: config.admin.username }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  res.json({ token, username: config.admin.username });
});
