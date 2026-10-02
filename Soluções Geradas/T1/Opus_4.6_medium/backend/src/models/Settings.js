import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  mainTitle: { type: String, required: true },
  subtitle: { type: String, required: true },
  whatsapp: { type: String, required: true },
});

export default mongoose.model('Settings', settingsSchema);
