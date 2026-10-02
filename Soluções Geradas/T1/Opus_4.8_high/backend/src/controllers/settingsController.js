import { Settings } from '../models/Settings.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * GET /api/settings
 * Retorna as configurações da vitrine (públicas).
 */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();
  res.json(settings);
});

/**
 * PUT /api/admin/settings
 * Atualiza as configurações principais da vitrine.
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();

  const fields = ['storeName', 'mainTitle', 'subtitle', 'whatsappNumber'];
  for (const field of fields) {
    if (req.body[field] !== undefined) {
      settings[field] = req.body[field];
    }
  }

  await settings.save();
  res.json(settings);
});
