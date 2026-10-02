import { Router } from "express";
import mongoose from "mongoose";
import { PRODUCT_FIELDS, Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendProductNotFound } from "../utils/notFound.js";
import { pick } from "../utils/pick.js";

export const adminProductsRouter = Router();

adminProductsRouter.param("id", (req, res, next, id) =>
  mongoose.isValidObjectId(id) ? next() : sendProductNotFound(res)
);

adminProductsRouter.get("/", asyncHandler(async (req, res) => {
  res.json(await Product.find().sort({ createdAt: -1 }));
}));

adminProductsRouter.get("/:id", asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return sendProductNotFound(res);
  res.json(product);
}));

adminProductsRouter.post("/", asyncHandler(async (req, res) => {
  res.status(201).json(await Product.create(pick(req.body, PRODUCT_FIELDS)));
}));

adminProductsRouter.put("/:id", asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, pick(req.body, PRODUCT_FIELDS), {
    new: true,
    runValidators: true,
  });
  if (!product) return sendProductNotFound(res);
  res.json(product);
}));

adminProductsRouter.delete("/:id", asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
}));
