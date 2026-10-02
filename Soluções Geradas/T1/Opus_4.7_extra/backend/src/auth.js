import jwt from 'jsonwebtoken';

function getSecret() {
  return process.env.JWT_SECRET || 'segredo-padrao-de-desenvolvimento';
}

export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: '8h' });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  try {
    req.admin = jwt.verify(header.slice(7), getSecret());
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
