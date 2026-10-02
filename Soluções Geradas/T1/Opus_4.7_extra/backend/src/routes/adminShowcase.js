import { Router } from 'express';
import Showcase from '../models/Showcase.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

const ALLOWED_FIELDS = ['storeName', 'heading', 'subheading', 'whatsappNumber'];

function pickFields(body) {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

router.get('/', async (req, res) => {
  const showcase = await Showcase.findOne();
  res.json(showcase || null);
});

router.put('/', async (req, res) => {
  try {
    const data = pickFields(req.body || {});
    let showcase = await Showcase.findOne();
    if (!showcase) {
      showcase = await Showcase.create(data);
    } else {
      Object.assign(showcase, data);
      await showcase.save();
    }
    res.json(showcase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
