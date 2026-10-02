import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    descricaoCurta: { type: String, required: true, trim: true },
    descricaoCompleta: { type: String, required: true, trim: true },
    preco: { type: String, required: true, trim: true },
    imagem: { type: String, required: true, trim: true },
    ativo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
