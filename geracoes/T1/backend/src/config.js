export const config = {
  port: 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tcc_catalog",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  tokenTtl: "8h",
};
