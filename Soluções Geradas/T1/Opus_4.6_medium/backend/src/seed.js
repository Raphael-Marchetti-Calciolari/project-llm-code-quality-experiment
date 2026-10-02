import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import Settings from './models/Settings.js';
import Product from './models/Product.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/catalogo';

await mongoose.connect(MONGODB_URI);

await Admin.deleteMany();
await Settings.deleteMany();
await Product.deleteMany();

await Admin.create({
  email: 'admin@loja.com',
  password: 'admin123',
});

await Settings.create({
  storeName: 'Minha Loja',
  mainTitle: 'Bem-vindo à nossa loja',
  subtitle: 'Produtos selecionados com carinho para você',
  whatsapp: '5511999999999',
});

await Product.create([
  {
    name: 'Camiseta Básica',
    slug: 'camiseta-basica',
    shortDescription: 'Camiseta 100% algodão, confortável e durável.',
    fullDescription: 'Camiseta básica feita com algodão de alta qualidade. Disponível em diversas cores. Ideal para o dia a dia, com acabamento reforçado e tecido macio.',
    price: 'R$ 49,90',
    imageUrl: 'https://picsum.photos/seed/camiseta/600/400',
    active: true,
  },
  {
    name: 'Caneca Personalizada',
    slug: 'caneca-personalizada',
    shortDescription: 'Caneca de cerâmica com estampa exclusiva.',
    fullDescription: 'Caneca de cerâmica resistente com capacidade de 350ml. Estampa exclusiva que não desbota. Pode ser usada no micro-ondas e lava-louças.',
    price: 'R$ 34,90',
    imageUrl: 'https://picsum.photos/seed/caneca/600/400',
    active: true,
  },
  {
    name: 'Caderno Artesanal',
    slug: 'caderno-artesanal',
    shortDescription: 'Caderno feito à mão com capa de couro sintético.',
    fullDescription: 'Caderno artesanal com 200 páginas de papel offset 90g. Capa em couro sintético com costura aparente. Perfeito para anotações, journaling ou presente.',
    price: 'R$ 62,00',
    imageUrl: 'https://picsum.photos/seed/caderno/600/400',
    active: true,
  },
  {
    name: 'Adesivo Decorativo',
    slug: 'adesivo-decorativo',
    shortDescription: 'Kit com 5 adesivos decorativos variados.',
    fullDescription: 'Kit com 5 adesivos em vinil de alta qualidade, resistentes à água. Ideais para notebooks, garrafas e cadernos. Designs exclusivos.',
    price: 'R$ 15,00',
    imageUrl: 'https://picsum.photos/seed/adesivo/600/400',
    active: false,
  },
]);

console.log('Dados iniciais criados com sucesso!');
console.log('Login admin: admin@loja.com / admin123');
await mongoose.disconnect();
