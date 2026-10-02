import { Router } from "express";
import { Product } from "../models/Product.js";
import { getSettings } from "../models/Settings.js";

export const publicRouter = Router();

publicRouter.get("/settings", async (req, res) => {
  res.json(await getSettings());
});

publicRouter.get("/products", async (req, res) => {
  res.json(await Product.find({ active: true }).sort({ createdAt: -1 }));
});

publicRouter.get("/products/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, active: true });
  if (!product) return res.status(404).json({ error: "Produto não encontrado" });
  res.json(product);
});
