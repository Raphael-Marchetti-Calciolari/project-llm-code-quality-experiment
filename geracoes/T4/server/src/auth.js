import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { config } from './config.js';

const TOKEN_TTL_SECONDS = 8 * 60 * 60;

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 32).toString('hex')}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, expected.length);
  return timingSafeEqual(actual, expected);
}

const sign = (data) => createHmac('sha256', config.tokenSecret).update(data).digest('base64url');

export function signToken(payload, ttl = TOKEN_TTL_SECONDS) {
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + ttl }),
  ).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function verifyToken(token) {
  const [body, signature] = String(token).split('.');
  if (!body || !signature) return null;
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch {
    return null;
  }
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const payload = header.startsWith('Bearer ') ? verifyToken(header.slice(7)) : null;
  if (!payload) return res.status(401).json({ error: 'Não autorizado' });
  req.admin = payload;
  next();
}
