import { connect } from './db.js';
import { config, ADMIN_SEED } from './config.js';
import { hashPassword } from './auth.js';

export const STORE_ID = 'store';

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
  const { client, db } = await connect(config.mongoUri);
  await seed(db, { reset: process.argv.includes('--reset') });
  await client.close();
  console.log('Seed concluído.');
}
