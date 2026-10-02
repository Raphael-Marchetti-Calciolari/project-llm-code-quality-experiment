export const PRODUCT_SORT = { name: 1 };

export const productNotFound = (res) => res.status(404).json({ error: 'Produto não encontrado' });
