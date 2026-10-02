import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Protege rotas administrativas exigindo um token JWT válido
 * no cabeçalho Authorization (formato "Bearer <token>").
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Autenticação necessária.'));
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    req.admin = { username: payload.sub };
    next();
  } catch {
    next(new ApiError(401, 'Sessão inválida ou expirada.'));
  }
}
