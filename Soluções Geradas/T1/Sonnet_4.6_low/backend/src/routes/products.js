import { Router } from 'express';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Público: lista produtos ativos
router.get('/', async (req, res) => {
  const products = await Product.find({ ativo: true }).sort({ createdAt: -1 });
  res.json(products);
});

// Público: produto por slug
router.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, ativo: true });
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

// Admin: lista todos os produtos
router.get('/admin', requireAuth, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// Admin: busca por id
router.get('/admin/:id', requireAuth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

// Admin: cria produto
router.post('/', requireAuth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: atualiza produto
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: exclui produto
router.delete('/:id', requireAuth, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json({ message: 'Produto excluído' });
});

export default router;
