import mongoose from 'mongoose';

/**
 * Configurações da vitrine.
 * Existe apenas um documento de configurações na aplicação
 * (a loja é única, conforme o escopo do MVP).
 */
const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'Minha Loja',
      trim: true,
    },
    mainTitle: {
      type: String,
      default: 'Bem-vindo à nossa loja',
      trim: true,
    },
    subtitle: {
      type: String,
      default: 'Confira nossos produtos e fale conosco pelo WhatsApp.',
      trim: true,
    },
    // Número de WhatsApp padrão, somente dígitos com DDI/DDD (ex.: 5511999999999).
    whatsappNumber: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

/**
 * Retorna o documento único de configurações, criando-o
 * com os valores padrão caso ainda não exista.
 */
settingsSchema.statics.getSingleton = async function getSingleton() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export const Settings = mongoose.model('Settings', settingsSchema);
