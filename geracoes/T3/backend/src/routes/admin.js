import { Router } from "express";
import { requireAuthToken } from "../middleware/auth.js";
import { adminProductsRouter } from "./adminProducts.js";
import { adminSettingsRouter } from "./adminSettings.js";

export const adminRouter = Router();
adminRouter.use(requireAuthToken);
adminRouter.use("/products", adminProductsRouter);
adminRouter.use("/settings", adminSettingsRouter);
