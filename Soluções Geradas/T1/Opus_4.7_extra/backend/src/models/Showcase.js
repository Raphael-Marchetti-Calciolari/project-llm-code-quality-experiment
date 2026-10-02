import mongoose from 'mongoose';

const showcaseSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true, trim: true },
    heading: { type: String, required: true, trim: true },
    subheading: { type: String, required: true, trim: true },
    whatsappNumber: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('Showcase', showcaseSchema);
