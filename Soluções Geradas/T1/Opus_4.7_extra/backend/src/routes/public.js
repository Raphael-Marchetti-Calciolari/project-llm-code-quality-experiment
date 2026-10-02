import { Router } from 'express';
import Product from '../models/Product.js';
import Showcase from '../models/Showcase.js';

const router = Router();

router.get('/showcase', async (req, res) => {
  const showcase = await Showcase.findOne();
  if (!showcase) return res.status(404).json({ error: 'Vitrine não configurada' });
  res.json(showcase);
});

router.get('/products', async (req, res) => {
  const products = await Product.find({ active: true }).sort('-createdAt');
  res.json(products);
});

router.get('/products/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, active: true });
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

export default router;
