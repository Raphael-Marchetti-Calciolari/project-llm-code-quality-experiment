import { Router } from 'express';
import Product from '../models/Product.js';
import Settings from '../models/Settings.js';

const router = Router();

router.get('/settings', async (_req, res) => {
  const settings = await Settings.findOne();
  if (!settings) return res.status(404).json({ error: 'Configurações não encontradas' });
  res.json(settings);
});

router.get('/products', async (_req, res) => {
  const products = await Product.find({ active: true }).sort({ createdAt: -1 });
  res.json(products);
});

router.get('/products/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, active: true });
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

export default router;
