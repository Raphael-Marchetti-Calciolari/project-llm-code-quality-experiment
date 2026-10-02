import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  if (
    usuario !== process.env.ADMIN_USER ||
    senha !== process.env.ADMIN_PASS
  ) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ usuario }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });
  res.json({ token });
});

export default router;
