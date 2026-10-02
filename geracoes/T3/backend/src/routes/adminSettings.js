import { Router } from "express";
import { SETTINGS_FIELDS, getSettings, updateSettings } from "../models/Settings.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pick } from "../utils/pick.js";

export const adminSettingsRouter = Router();

adminSettingsRouter.get("/", asyncHandler(async (req, res) => {
  res.json(await getSettings());
}));

adminSettingsRouter.put("/", asyncHandler(async (req, res) => {
  res.json(await updateSettings(pick(req.body, SETTINGS_FIELDS)));
}));
