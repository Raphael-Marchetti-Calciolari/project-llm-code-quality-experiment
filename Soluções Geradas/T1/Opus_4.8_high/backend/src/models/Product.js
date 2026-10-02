import mongoose from 'mongoose';

/**
 * Produto exibido na vitrine.
 * Contém os dados mínimos necessários para a listagem pública,
 * a página de detalhes e o gerenciamento administrativo.
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'O nome do produto é obrigatório.'],
      trim: true,
    },
    // Identificador amigável para a URL (ex.: "camiseta-branca").
    slug: {
      type: String,
      required: [true, 'O identificador (slug) é obrigatório.'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    fullDescription: {
      type: String,
      default: '',
      trim: true,
    },
    // Preço em texto livre (ex.: "R$ 99,90" ou "Sob consulta").
    price: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
