import { Router } from 'express';
import { getSettings } from '../controllers/settingsController.js';
import {
  listPublicProducts,
  getPublicProductBySlug,
} from '../controllers/productController.js';

const router = Router();

// Configurações da vitrine (nome da loja, títulos, WhatsApp).
router.get('/settings', getSettings);

// Catálogo público (somente produtos ativos).
router.get('/products', listPublicProducts);
router.get('/products/:slug', getPublicProductBySlug);

export default router;
