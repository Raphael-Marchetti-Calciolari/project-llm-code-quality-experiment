import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/catalogo';
const PORT = process.env.PORT || 3001;

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Conectado ao MongoDB');
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err.message);
  process.exit(1);
});
