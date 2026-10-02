import { Router } from 'express';
import { STORE_ID } from '../store.js';
import { toProductDto, toStoreDto } from '../dto.js';
import { PRODUCT_SORT, productNotFound } from './shared.js';

export function publicRoutes(db) {
  const router = Router();
  const products = db.collection('products');

  router.get('/store', async (_req, res) => {
    res.json(toStoreDto(await db.collection('settings').findOne({ _id: STORE_ID }) || undefined));
  });

  router.get('/products', async (_req, res) => {
    const list = await products.find({ active: true }).sort(PRODUCT_SORT).toArray();
    res.json(list.map(toProductDto));
  });

  router.get('/products/:slug', async (req, res) => {
    const product = await products.findOne({ slug: req.params.slug, active: true });
    if (!product) return productNotFound(res);
    res.json(toProductDto(product));
  });

  return router;
}
