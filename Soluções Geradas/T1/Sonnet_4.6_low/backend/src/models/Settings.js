import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  nomeLoja: { type: String, default: 'Minha Loja' },
  tituloPrincipal: { type: String, default: 'Bem-vindo à nossa loja' },
  subtitulo: { type: String, default: 'Encontre os melhores produtos' },
  whatsapp: { type: String, default: '5511999999999' },
});

export default mongoose.model('Settings', settingsSchema);
