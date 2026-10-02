import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Nome e slug são obrigatórios"], trim: true },
    slug: { type: String, required: [true, "Nome e slug são obrigatórios"], unique: true, trim: true, lowercase: true },
    shortDescription: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    price: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PRODUCT_FIELDS = Object.keys(productSchema.paths).filter(
  (f) => !["_id", "__v", "createdAt", "updatedAt"].includes(f)
);

export const Product = mongoose.model("Product", productSchema);
