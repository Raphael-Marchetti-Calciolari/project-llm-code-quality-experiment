import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuração centralizada da aplicação.
 * Lê as variáveis de ambiente uma única vez e aplica valores padrão
 * adequados para o ambiente de desenvolvimento local.
 */
export const config = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/catalogo',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'segredo-de-desenvolvimento',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};
