import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { signToken } from '../auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Informe usuário e senha' });
  }
  const admin = await Admin.findOne({ username: String(username).toLowerCase() });
  if (!admin) return res.status(401).json({ error: 'Credenciais inválidas' });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });
  const token = signToken({ id: admin._id.toString(), username: admin.username });
  res.json({ token, username: admin.username });
});

export default router;
