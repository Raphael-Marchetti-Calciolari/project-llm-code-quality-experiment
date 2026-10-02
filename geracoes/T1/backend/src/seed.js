import mongoose from "mongoose";
import { config } from "./config.js";
import { Admin, hashPassword } from "./models/Admin.js";
import { Product } from "./models/Product.js";
import { Settings } from "./models/Settings.js";

await mongoose.connect(config.mongoUri);
await mongoose.connection.dropDatabase();

await Admin.create({ email: "admin@teste.local", passwordHash: hashPassword("admin123") });
await Settings.create({
  storeName: "Minha Loja",
  headline: "Bem-vindo à nossa vitrine",
  subtitle: "Confira nossos produtos e fale conosco pelo WhatsApp",
  whatsappNumber: "5511999999999",
});
await Product.create({
  name: "Produto Fixture",
  slug: "produto-fixture",
  shortDescription: "Produto para testes",
  description: "Descrição completa do produto para testes",
  price: "R$ 10,00",
  imageUrl: "https://placehold.co/600x400?text=Produto+Fixture",
  active: true,
});

console.log("Banco populado.");
await mongoose.disconnect();
