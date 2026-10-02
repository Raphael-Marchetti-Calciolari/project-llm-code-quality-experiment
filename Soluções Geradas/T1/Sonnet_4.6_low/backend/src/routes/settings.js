import { Router } from 'express';
import Settings from '../models/Settings.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

async function getOrCreate() {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
}

// Público: lê configurações da vitrine
router.get('/', async (req, res) => {
  res.json(await getOrCreate());
});

// Admin: atualiza configurações
router.put('/', requireAuth, async (req, res) => {
  const settings = await getOrCreate();
  Object.assign(settings, req.body);
  await settings.save();
  res.json(settings);
});

export default router;
