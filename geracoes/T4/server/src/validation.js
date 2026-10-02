import { slugify } from './slug.js';

const trimmedString = (v) => (typeof v === 'string' ? v.trim() : '');

export function parseProduct(body = {}) {
  const product = {
    name: trimmedString(body.name),
    slug: slugify(trimmedString(body.slug) || trimmedString(body.name)),
    shortDescription: trimmedString(body.shortDescription),
    description: trimmedString(body.description),
    price: trimmedString(body.price),
    imageUrl: trimmedString(body.imageUrl),
    active: body.active !== false,
  };
  const labels = { name: 'nome', slug: 'slug', shortDescription: 'descrição curta', description: 'descrição completa', price: 'preço', imageUrl: 'imagem' };
  const missing = Object.keys(labels).filter((k) => !product[k]);
  if (missing.length) return { error: `Campos obrigatórios: ${missing.map((k) => labels[k]).join(', ')}` };
  return { value: product };
}

export function parseStore(body = {}) {
  const store = {
    storeName: trimmedString(body.storeName),
    headline: trimmedString(body.headline),
    subtitle: trimmedString(body.subtitle),
    whatsapp: trimmedString(body.whatsapp).replace(/[\s()+-]/g, ''),
  };
  if (!store.storeName || !store.headline) return { error: 'Nome da loja e título são obrigatórios' };
  if (!/^\d{10,15}$/.test(store.whatsapp)) return { error: 'WhatsApp deve conter de 10 a 15 dígitos' };
  return { value: store };
}
