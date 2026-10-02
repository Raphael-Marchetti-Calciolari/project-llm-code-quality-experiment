import mongoose from 'mongoose';
import { config } from './env.js';

/**
 * Conecta a aplicação ao MongoDB usando o Mongoose.
 * Lança o erro para que o chamador decida como tratar a falha.
 */
export async function connectDatabase() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongoUri);
  console.log(`MongoDB conectado em ${config.mongoUri}`);
}
