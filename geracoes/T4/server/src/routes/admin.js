import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { requireAdmin, signToken, verifyPassword } from '../auth.js';
import { parseProduct, parseStore } from '../validation.js';
import { STORE_ID } from '../store.js';
import { toProductDto } from '../dto.js';
import { PRODUCT_SORT, productNotFound } from './shared.js';

const DUPLICATE_KEY = 11000;

function toObjectId(id) {
  return ObjectId.isValid(id) && String(id).length === 24 ? new ObjectId(id) : null;
}

export function adminRoutes(db) {
  const router = Router();
  const products = db.collection('products');

  router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }
    const admin = await db.collection('admins').findOne({ email });
    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    res.json({ token: signToken({ sub: admin.email }) });
  });

  router.use(requireAdmin);

  // Valida o id da rota e carrega o filtro de busca em req.filter.
  router.param('id', (req, res, next, id) => {
    const _id = toObjectId(id);
    if (!_id) return productNotFound(res);
    req.filter = { _id };
    next();
  });

  const isDuplicateKey = (err) => err.code === DUPLICATE_KEY;
  const conflict = (res) => res.status(409).json({ error: 'Slug já está em uso' });

  async function updateProduct(res, filter, changes) {
    const updated = await products.findOneAndUpdate(filter, { $set: changes }, { returnDocument: 'after' });
    if (!updated) return productNotFound(res);
    res.json(toProductDto(updated));
  }

  router.get('/products', async (_req, res) => {
    res.json((await products.find().sort(PRODUCT_SORT).toArray()).map(toProductDto));
  });

  router.get('/products/:id', async (req, res) => {
    const product = await products.findOne(req.filter);
    if (!product) return productNotFound(res);
    res.json(toProductDto(product));
  });

  router.post('/products', async (req, res) => {
    const { value, error } = parseProduct(req.body);
    if (error) return res.status(400).json({ error });
    try {
      const { insertedId } = await products.insertOne({ ...value });
      res.status(201).json(toProductDto({ _id: insertedId, ...value }));
    } catch (err) {
      if (isDuplicateKey(err)) return conflict(res);
      throw err;
    }
  });

  router.put('/products/:id', async (req, res) => {
    const { value, error } = parseProduct(req.body);
    if (error) return res.status(400).json({ error });
    try {
      await updateProduct(res, req.filter, value);
    } catch (err) {
      if (isDuplicateKey(err)) return conflict(res);
      throw err;
    }
  });

  router.patch('/products/:id/active', async (req, res) => {
    if (typeof req.body?.active !== 'boolean') return res.status(400).json({ error: 'Campo active inválido' });
    await updateProduct(res, req.filter, { active: req.body.active });
  });

  router.delete('/products/:id', async (req, res) => {
    const { deletedCount } = await products.deleteOne(req.filter);
    if (!deletedCount) return productNotFound(res);
    res.status(204).end();
  });

  router.put('/store', async (req, res) => {
    const { value, error } = parseStore(req.body);
    if (error) return res.status(400).json({ error });
    await db.collection('settings').updateOne({ _id: STORE_ID }, { $set: value }, { upsert: true });
    res.json(value);
  });

  return router;
}
