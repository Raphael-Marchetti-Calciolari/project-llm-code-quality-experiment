import 'dotenv/config';
import { connectDB } from './config/db.js';
import Product from './models/Product.js';
import Settings from './models/Settings.js';

await connectDB();

await Product.deleteMany();
await Settings.deleteMany();

await Settings.create({
  nomeLoja: 'Arte & Casa',
  tituloPrincipal: 'Decoração com alma',
  subtitulo: 'Peças únicas para tornar seu lar mais especial',
  whatsapp: '5511912345678',
});

await Product.insertMany([
  {
    nome: 'Vaso de Cerâmica Azul',
    slug: 'vaso-ceramica-azul',
    descricaoCurta: 'Vaso artesanal feito à mão em cerâmica esmaltada.',
    descricaoCompleta:
      'Vaso produzido por artesãos locais com argila natural e esmalte azul cobalto. Ideal para flores secas ou como objeto decorativo. Dimensões: 25 cm de altura × 12 cm de diâmetro.',
    preco: 'R$ 89,90',
    imagem: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
    ativo: true,
  },
  {
    nome: 'Quadro Abstrato – Manhã Dourada',
    slug: 'quadro-abstrato-manha-dourada',
    descricaoCurta: 'Pintura em tela com tons quentes de dourado e terracota.',
    descricaoCompleta:
      'Obra original pintada à mão em tela de algodão com tintas acrílicas de alta qualidade. Acompanha moldura de madeira natural. Medidas: 60 cm × 80 cm. Cada peça é única.',
    preco: 'R$ 320,00',
    imagem: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600',
    ativo: true,
  },
  {
    nome: 'Almofada Bordada Floral',
    slug: 'almofada-bordada-floral',
    descricaoCurta: 'Almofada com bordado floral feito à mão, capa removível.',
    descricaoCompleta:
      'Almofada confeccionada com tecido de linho natural e bordado floral manual. Capa com zíper removível para lavagem. Enchimento em fibra siliconada. Tamanho: 45 cm × 45 cm.',
    preco: 'R$ 145,00',
    imagem: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
    ativo: true,
  },
  {
    nome: 'Porta-Velas de Madeira Rústica',
    slug: 'porta-velas-madeira-rustica',
    descricaoCurta: 'Suporte triplo para velas em madeira de demolição.',
    descricaoCompleta:
      'Porta-velas fabricado com madeira de demolição reaproveitada, lixada e selada com verniz natural. Suporta três velas de até 4 cm de diâmetro. Comprimento: 35 cm.',
    preco: 'R$ 68,00',
    imagem: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    ativo: true,
  },
  {
    nome: 'Tapete de Crochê Redondo',
    slug: 'tapete-croche-redondo',
    descricaoCurta: 'Tapete artesanal de crochê em algodão cru, 80 cm.',
    descricaoCompleta:
      'Tapete confeccionado em fio de algodão cru 100% natural, produzido por cooperativa de artesãs. Lavável à máquina em ciclo delicado. Diâmetro: 80 cm.',
    preco: 'R$ 210,00',
    imagem: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
    ativo: false,
  },
]);

console.log('Dados iniciais inseridos com sucesso.');
process.exit(0);
