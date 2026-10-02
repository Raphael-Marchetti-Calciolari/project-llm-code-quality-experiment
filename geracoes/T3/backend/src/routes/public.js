import { Router } from "express";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendProductNotFound } from "../utils/notFound.js";
import { getSettings } from "../models/Settings.js";

export const publicRouter = Router();

publicRouter.get("/settings", asyncHandler(async (req, res) => {
  res.json(await getSettings());
}));

publicRouter.get("/products", asyncHandler(async (req, res) => {
  res.json(await Product.find({ active: true }).sort({ createdAt: -1 }));
}));

publicRouter.get("/products/:slug", asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, active: true });
  if (!product) return sendProductNotFound(res);
  res.json(product);
}));
