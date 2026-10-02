import mongoose from 'mongoose';
import { connectDatabase } from './config/db.js';
import { Product } from './models/Product.js';
import { Settings } from './models/Settings.js';

/**
 * Dados iniciais de exemplo para a vitrine.
 */
const sampleSettings = {
  storeName: 'Loja do Bairro',
  mainTitle: 'Produtos selecionados para você',
  subtitle: 'Qualidade e atendimento próximo. Fale conosco pelo WhatsApp!',
  whatsappNumber: '5511999999999',
};

const sampleProducts = [
  {
    name: 'Camiseta Básica Algodão',
    slug: 'camiseta-basica-algodao',
    shortDescription: 'Camiseta confortável de algodão para o dia a dia.',
    fullDescription:
      'Camiseta unissex em algodão penteado, com modelagem regular e ótimo caimento. ' +
      'Disponível em diversas cores. Ideal para uso casual e combinações variadas.',
    price: 'R$ 49,90',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
  {
    name: 'Caneca de Cerâmica 300ml',
    slug: 'caneca-ceramica-300ml',
    shortDescription: 'Caneca de cerâmica resistente, perfeita para o café.',
    fullDescription:
      'Caneca de cerâmica com capacidade de 300ml, acabamento brilhante e alça ergonômica. ' +
      'Pode ser usada em micro-ondas e lava-louças. Um clássico para o seu cafezinho.',
    price: 'R$ 29,90',
    imageUrl:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
  {
    name: 'Mochila Urbana Resistente',
    slug: 'mochila-urbana-resistente',
    shortDescription: 'Mochila espaçosa com compartimento para notebook.',
    fullDescription:
      'Mochila urbana em material resistente à água, com compartimento acolchoado para notebook ' +
      'de até 15 polegadas, vários bolsos organizadores e alças ajustáveis confortáveis.',
    price: 'R$ 189,90',
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
  {
    name: 'Fone de Ouvido Sem Fio',
    slug: 'fone-de-ouvido-sem-fio',
    shortDescription: 'Fone bluetooth com ótima qualidade de som.',
    fullDescription:
      'Fone de ouvido sem fio com conexão Bluetooth estável, bateria de longa duração e ' +
      'estojo de carregamento compacto. Som equilibrado e graves marcantes.',
    price: 'R$ 149,90',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    active: false,
  },
];

/**
 * Popula o banco com dados de exemplo.
 * Substitui produtos e configurações existentes para garantir um estado conhecido.
 */
async function seed() {
  try {
    await connectDatabase();

    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} produtos inseridos.`);

    await Settings.deleteMany({});
    await Settings.create(sampleSettings);
    console.log('Configurações da vitrine criadas.');

    console.log('Seed concluído com sucesso.');
  } catch (error) {
    console.error('Erro ao executar o seed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seed();
