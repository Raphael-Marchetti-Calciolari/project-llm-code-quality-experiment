export const config = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tcc_catalog',
  tokenSecret: process.env.TOKEN_SECRET || 'dev-secret-change-me',
};
