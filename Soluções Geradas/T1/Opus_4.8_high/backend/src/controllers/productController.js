import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';

/**
 * Monta o objeto de dados de um produto a partir do corpo da requisição,
 * normalizando o slug (gerado a partir do nome quando não informado).
 */
function buildProductData(body) {
  const data = {
    name: body.name,
    shortDescription: body.shortDescription,
    fullDescription: body.fullDescription,
    price: body.price,
    imageUrl: body.imageUrl,
  };

  if (typeof body.active === 'boolean') {
    data.active = body.active;
  }

  const slugSource = body.slug?.trim() ? body.slug : body.name;
  if (slugSource) {
    data.slug = slugify(slugSource);
  }

  return data;
}

/* ------------------------- Área pública ------------------------- */

/**
 * GET /api/products
 * Lista apenas os produtos ativos, ordenados do mais recente ao mais antigo.
 */
export const listPublicProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ active: true }).sort({ createdAt: -1 });
  res.json(products);
});

/**
 * GET /api/products/:slug
 * Retorna os detalhes de um produto ativo a partir do seu slug.
 */
export const getPublicProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, active: true });
  if (!product) {
    throw new ApiError(404, 'Produto não encontrado.');
  }
  res.json(product);
});

/* --------------------- Área administrativa ---------------------- */

/**
 * GET /api/admin/products
 * Lista todos os produtos (ativos e inativos) para gerenciamento.
 */
export const listAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

/**
 * GET /api/admin/products/:id
 * Retorna um produto pelo seu identificador para edição.
 */
export const getAdminProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Produto não encontrado.');
  }
  res.json(product);
});

/**
 * POST /api/admin/products
 * Cria um novo produto.
 */
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(buildProductData(req.body));
  res.status(201).json(product);
});

/**
 * PUT /api/admin/products/:id
 * Atualiza os dados de um produto existente.
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Produto não encontrado.');
  }

  Object.assign(product, buildProductData(req.body));
  await product.save();
  res.json(product);
});

/**
 * PATCH /api/admin/products/:id/toggle
 * Ativa ou inativa um produto, invertendo o status atual.
 */
export const toggleProductActive = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Produto não encontrado.');
  }

  product.active = !product.active;
  await product.save();
  res.json(product);
});

/**
 * DELETE /api/admin/products/:id
 * Exclui um produto permanentemente.
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Produto não encontrado.');
  }
  res.status(204).end();
});
