import { slugify } from './slug.js';

const text = (v) => (typeof v === 'string' ? v.trim() : '');

export function parseProduct(body = {}) {
  const product = {
    name: text(body.name),
    slug: slugify(text(body.slug) || text(body.name)),
    shortDescription: text(body.shortDescription),
    description: text(body.description),
    price: text(body.price),
    imageUrl: text(body.imageUrl),
    active: body.active !== false,
  };
  const labels = { name: 'nome', slug: 'slug', shortDescription: 'descrição curta', description: 'descrição completa', price: 'preço', imageUrl: 'imagem' };
  const missing = Object.keys(labels).filter((k) => !product[k]);
  if (missing.length) return { error: `Campos obrigatórios: ${missing.map((k) => labels[k]).join(', ')}` };
  return { value: product };
}

export function parseStore(body = {}) {
  const store = {
    storeName: text(body.storeName),
    headline: text(body.headline),
    subtitle: text(body.subtitle),
    whatsapp: text(body.whatsapp).replace(/[\s()+-]/g, ''),
  };
  if (!store.storeName || !store.headline) return { error: 'Nome da loja e título são obrigatórios' };
  if (!/^\d{10,15}$/.test(store.whatsapp)) return { error: 'WhatsApp deve conter de 10 a 15 dígitos' };
  return { value: store };
}
