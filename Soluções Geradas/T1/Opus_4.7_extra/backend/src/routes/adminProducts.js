import { Router } from 'express';
import Product from '../models/Product.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

const ALLOWED_FIELDS = ['name', 'slug', 'shortDescription', 'fullDescription', 'price', 'imageUrl', 'active'];

function pickFields(body) {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

router.get('/', async (req, res) => {
  const products = await Product.find().sort('-createdAt');
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(pickFields(req.body || {}));
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      pickFields(req.body || {}),
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/toggle', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  product.active = !product.active;
  await product.save();
  res.json(product);
});

router.delete('/:id', async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json({ ok: true });
});

export default router;
