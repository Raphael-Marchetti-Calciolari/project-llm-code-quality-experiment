import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, default: "" },
  headline: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  whatsappNumber: { type: String, default: "" },
});

export const SETTINGS_FIELDS = Object.keys(settingsSchema.paths).filter((f) => !["_id", "__v"].includes(f));

export const Settings = mongoose.model("Settings", settingsSchema);

export async function getSettings() {
  return (await Settings.findOne()) || Settings.create({});
}

export async function updateSettings(fields) {
  return Settings.findOneAndUpdate({}, fields, { new: true, upsert: true, setDefaultsOnInsert: true });
}
