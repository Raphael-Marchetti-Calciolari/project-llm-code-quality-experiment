import { Router } from 'express';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js';
import Product from '../models/Product.js';
import Settings from '../models/Settings.js';
import Admin from '../models/Admin.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta-desenvolvimento';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

router.use(auth);

router.get('/products', async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

router.patch('/products/:id/toggle', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  product.active = !product.active;
  await product.save();
  res.json(product);
});

router.delete('/products/:id', async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json({ message: 'Produto excluído' });
});

router.get('/settings', async (_req, res) => {
  const settings = await Settings.findOne();
  if (!settings) return res.status(404).json({ error: 'Configurações não encontradas' });
  res.json(settings);
});

router.put('/settings', async (req, res) => {
  const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
  if (!settings) return res.status(404).json({ error: 'Configurações não encontradas' });
  res.json(settings);
});

export default router;
