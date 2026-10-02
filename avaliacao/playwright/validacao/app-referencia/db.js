const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://127.0.0.1:27017');
const db = client.db('tcc_catalog');

async function seed() {
  await db.dropDatabase();
  await db.collection('settings').insertOne({
    storeName: 'Loja Referência', title: 'Catálogo', subtitle: 'Produtos', whatsapp: '5511999999999',
  });
  await db.collection('products').insertOne({
    name: 'Produto Fixture',
    slug: 'produto-fixture',
    shortDescription: 'Produto para testes',
    description: 'Descrição completa do produto para testes',
    price: 'R$ 10,00',
    imageUrl: 'https://example.com/tcc/fixture.png',
    active: true,
  });
}

module.exports = { client, db };

if (require.main === module && process.argv[2] === 'seed') {
  seed().then(() => client.close()).catch((e) => { console.error(e); process.exit(1); });
}
