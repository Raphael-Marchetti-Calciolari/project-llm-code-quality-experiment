export const PRODUCT_NOT_FOUND = "Produto não encontrado";

export const sendProductNotFound = (res) => res.status(404).json({ error: PRODUCT_NOT_FOUND });
