import { MongoClient } from 'mongodb';

export async function connect(uri) {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  await db.collection('products').createIndex({ slug: 1 }, { unique: true });
  return { client, db };
}

export async function connectOrExit(uri) {
  try {
    return await connect(uri);
  } catch (err) {
    console.error(`Não foi possível conectar ao MongoDB em ${uri}: ${err.message}`);
    process.exit(1);
  }
}
