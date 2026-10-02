import { Router } from 'express';
import { STORE_ID } from '../seed.js';
import { toDto } from './products-dto.js';

export function publicRoutes(db) {
  const router = Router();
  const products = db.collection('products');

  router.get('/store', async (_req, res) => {
    const { _id, ...store } = (await db.collection('settings').findOne({ _id: STORE_ID })) || {};
    res.json(store);
  });

  router.get('/products', async (_req, res) => {
    const list = await products.find({ active: true }).sort({ name: 1 }).toArray();
    res.json(list.map(toDto));
  });

  router.get('/products/:slug', async (req, res) => {
    const product = await products.findOne({ slug: req.params.slug, active: true });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(toDto(product));
  });

  return router;
}
