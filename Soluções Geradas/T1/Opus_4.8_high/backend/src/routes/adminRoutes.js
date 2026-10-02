import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  listAdminProducts,
  getAdminProduct,
  createProduct,
  updateProduct,
  toggleProductActive,
  deleteProduct,
} from '../controllers/productController.js';
import { updateSettings } from '../controllers/settingsController.js';

const router = Router();

// Todas as rotas administrativas exigem autenticação.
router.use(requireAuth);

// Gerenciamento de produtos.
router.get('/products', listAdminProducts);
router.post('/products', createProduct);
router.get('/products/:id', getAdminProduct);
router.put('/products/:id', updateProduct);
router.patch('/products/:id/toggle', toggleProductActive);
router.delete('/products/:id', deleteProduct);

// Configurações da vitrine.
router.put('/settings', updateSettings);

export default router;
