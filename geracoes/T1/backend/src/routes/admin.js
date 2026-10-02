import { Router } from "express";
import { Product } from "../models/Product.js";
import { Settings, getSettings } from "../models/Settings.js";
import { requireAdmin } from "../middleware/auth.js";

export const adminRouter = Router();
adminRouter.use(requireAdmin);

const PRODUCT_FIELDS = ["name", "slug", "shortDescription", "description", "price", "imageUrl", "active"];
const SETTINGS_FIELDS = ["storeName", "headline", "subtitle", "whatsappNumber"];

const pick = (source, fields) =>
  Object.fromEntries(fields.filter((f) => source?.[f] !== undefined).map((f) => [f, source[f]]));

function handleSaveError(err, res) {
  if (err.code === 11000) return res.status(409).json({ error: "Slug já está em uso" });
  if (err.name === "ValidationError") return res.status(400).json({ error: "Nome e slug são obrigatórios" });
  throw err;
}

adminRouter.get("/products", async (req, res) => {
  res.json(await Product.find().sort({ createdAt: -1 }));
});

adminRouter.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).catch(() => null);
  if (!product) return res.status(404).json({ error: "Produto não encontrado" });
  res.json(product);
});

adminRouter.post("/products", async (req, res) => {
  try {
    res.status(201).json(await Product.create(pick(req.body, PRODUCT_FIELDS)));
  } catch (err) {
    handleSaveError(err, res);
  }
});

adminRouter.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, pick(req.body, PRODUCT_FIELDS), {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(product);
  } catch (err) {
    handleSaveError(err, res);
  }
});

adminRouter.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

adminRouter.get("/settings", async (req, res) => {
  res.json(await getSettings());
});

adminRouter.put("/settings", async (req, res) => {
  const current = await getSettings();
  res.json(await Settings.findByIdAndUpdate(current.id, pick(req.body, SETTINGS_FIELDS), { new: true }));
});
