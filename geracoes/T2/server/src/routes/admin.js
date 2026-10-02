import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { requireAdmin, signToken, verifyPassword } from '../auth.js';
import { parseProduct, parseStore } from '../validation.js';
import { STORE_ID } from '../seed.js';
import { toDto } from './products-dto.js';

const DUPLICATE_KEY = 11000;

function toObjectId(id) {
  return ObjectId.isValid(id) && String(id).length === 24 ? new ObjectId(id) : null;
}

export function adminRoutes(db) {
  const router = Router();
  const products = db.collection('products');

  router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    const admin = await db.collection('admins').findOne({ email: String(email) });
    if (!admin || !verifyPassword(String(password), admin.passwordHash)) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    res.json({ token: signToken({ sub: admin.email }) });
  });

  router.use(requireAdmin);

  // Valida o id da rota e carrega o filtro de busca em req.filter.
  router.param('id', (req, res, next, id) => {
    const _id = toObjectId(id);
    if (!_id) return res.status(404).json({ error: 'Produto não encontrado' });
    req.filter = { _id };
    next();
  });

  const notFound = (res) => res.status(404).json({ error: 'Produto não encontrado' });

  const saveHandling = (res, action) =>
    action().catch((err) => {
      if (err.code === DUPLICATE_KEY) return res.status(409).json({ error: 'Slug já está em uso' });
      throw err;
    });

  router.get('/products', async (_req, res) => {
    res.json((await products.find().sort({ name: 1 }).toArray()).map(toDto));
  });

  router.get('/products/:id', async (req, res) => {
    const product = await products.findOne(req.filter);
    product ? res.json(toDto(product)) : notFound(res);
  });

  router.post('/products', async (req, res) => {
    const { value, error } = parseProduct(req.body);
    if (error) return res.status(400).json({ error });
    await saveHandling(res, async () => {
      const { insertedId } = await products.insertOne({ ...value });
      res.status(201).json(toDto({ _id: insertedId, ...value }));
    });
  });

  router.put('/products/:id', async (req, res) => {
    const { value, error } = parseProduct(req.body);
    if (error) return res.status(400).json({ error });
    await saveHandling(res, async () => {
      const updated = await products.findOneAndUpdate(req.filter, { $set: value }, { returnDocument: 'after' });
      updated ? res.json(toDto(updated)) : notFound(res);
    });
  });

  router.patch('/products/:id/active', async (req, res) => {
    if (typeof req.body?.active !== 'boolean') return res.status(400).json({ error: 'Campo active inválido' });
    const updated = await products.findOneAndUpdate(req.filter, { $set: { active: req.body.active } }, { returnDocument: 'after' });
    updated ? res.json(toDto(updated)) : notFound(res);
  });

  router.delete('/products/:id', async (req, res) => {
    const { deletedCount } = await products.deleteOne(req.filter);
    deletedCount ? res.status(204).end() : notFound(res);
  });

  router.put('/store', async (req, res) => {
    const { value, error } = parseStore(req.body);
    if (error) return res.status(400).json({ error });
    await db.collection('settings').updateOne({ _id: STORE_ID }, { $set: value }, { upsert: true });
    res.json(value);
  });

  return router;
}
