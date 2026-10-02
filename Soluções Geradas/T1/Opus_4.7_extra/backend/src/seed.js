import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Admin from './models/Admin.js';
import Showcase from './models/Showcase.js';
import Product from './models/Product.js';

dotenv.config();

const SAMPLE_PRODUCTS = [
  {
    name: 'Camiseta Básica Algodão',
    slug: 'camiseta-basica-algodao',
    shortDescription: 'Camiseta confortável em algodão 100% para o dia a dia',
    fullDescription:
      'Camiseta em algodão 100%, com modelagem regular e acabamento de qualidade. Ideal para usar em qualquer ocasião. Disponível em várias cores e tamanhos do P ao GG.',
    price: 'R$ 49,90',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    active: true
  },
  {
    name: 'Caneca de Cerâmica Personalizada',
    slug: 'caneca-ceramica-personalizada',
    shortDescription: 'Caneca de cerâmica 300ml com design exclusivo',
    fullDescription:
      'Caneca em cerâmica de alta qualidade, com capacidade de 300ml. Pode ser personalizada com nome ou frase de sua escolha. Resistente ao micro-ondas e à lava-louças.',
    price: 'R$ 29,90',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
    active: true
  },
  {
    name: 'Mochila Casual Resistente',
    slug: 'mochila-casual-resistente',
    shortDescription: 'Mochila espaçosa com compartimento para notebook',
    fullDescription:
      'Mochila casual com diversos compartimentos, incluindo bolso acolchoado para notebook de até 15 polegadas. Tecido resistente à água e alças ergonômicas.',
    price: 'R$ 159,00',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    active: true
  },
  {
    name: 'Tênis Esportivo Leve',
    slug: 'tenis-esportivo-leve',
    shortDescription: 'Tênis confortável para corrida e caminhada',
    fullDescription:
      'Tênis esportivo com solado em EVA e cabedal respirável. Ideal para corrida, caminhada e atividades do dia a dia. Numeração do 36 ao 44.',
    price: 'R$ 249,90',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    active: false
  }
];

async function seed() {
  await connectDB();

  const adminUsername = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const existingAdmin = await Admin.findOne({ username: adminUsername });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await Admin.create({ username: adminUsername, passwordHash });
    console.log(`Administrador criado: ${adminUsername} / ${adminPassword}`);
  } else {
    console.log(`Administrador já existe: ${adminUsername}`);
  }

  const existingShowcase = await Showcase.findOne();
  if (!existingShowcase) {
    await Showcase.create({
      storeName: 'Loja Exemplo',
      heading: 'Produtos selecionados para você',
      subheading: 'Confira nossa vitrine e fale conosco pelo WhatsApp',
      whatsappNumber: '5511999999999'
    });
    console.log('Vitrine inicial criada');
  } else {
    console.log('Vitrine já existe');
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(SAMPLE_PRODUCTS);
    console.log(`${SAMPLE_PRODUCTS.length} produtos de exemplo inseridos`);
  } else {
    console.log(`Produtos já existem (${productCount} registros)`);
  }

  await mongoose.disconnect();
  console.log('Seed finalizado');
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
