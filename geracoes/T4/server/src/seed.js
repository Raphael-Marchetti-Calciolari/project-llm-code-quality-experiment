import { connectOrExit } from './db.js';
import { config } from './config.js';
import { STORE_ID } from './store.js';
import { hashPassword } from './auth.js';

const ADMIN_SEED = { email: 'admin@teste.local', password: 'admin123' };

export async function seed(db, { reset = false } = {}) {
  if (reset) {
    await Promise.all(['products', 'settings', 'admins'].map((c) => db.collection(c).deleteMany({})));
  }
  await db.collection('settings').replaceOne(
    { _id: STORE_ID },
    {
      _id: STORE_ID,
      storeName: 'Minha Loja',
      headline: 'Bem-vindo à nossa vitrine',
      subtitle: 'Confira nossos produtos e fale conosco pelo WhatsApp',
      whatsapp: '5511999999999',
    },
    { upsert: true },
  );
  await db.collection('admins').replaceOne(
    { email: ADMIN_SEED.email },
    { email: ADMIN_SEED.email, passwordHash: hashPassword(ADMIN_SEED.password) },
    { upsert: true },
  );
  await db.collection('products').replaceOne(
    { slug: 'produto-fixture' },
    {
      name: 'Produto Fixture',
      slug: 'produto-fixture',
      shortDescription: 'Produto para testes',
      description: 'Descrição completa do produto para testes',
      price: 'R$ 10,00',
      imageUrl: 'https://placehold.co/600x400?text=Produto+Fixture',
      active: true,
    },
    { upsert: true },
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { client, db } = await connectOrExit(config.mongoUri);
  try {
    await seed(db, { reset: process.argv.includes('--reset') });
  } finally {
    await client.close();
  }
  console.log('Seed concluído.');
}
