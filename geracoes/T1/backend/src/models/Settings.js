import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, default: "" },
  headline: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  whatsappNumber: { type: String, default: "" },
});

export const Settings = mongoose.model("Settings", settingsSchema);

export async function getSettings() {
  return (await Settings.findOne()) || Settings.create({});
}
