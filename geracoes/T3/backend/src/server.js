import mongoose from "mongoose";
import { app } from "./app.js";
import { config } from "./config.js";

try {
  await mongoose.connect(config.mongoUri);
} catch (err) {
  console.error(`Falha ao conectar ao MongoDB (${config.mongoUri}): ${err.message}`);
  process.exit(1);
}
app.listen(config.port, () => console.log(`API em http://localhost:${config.port}/api`));
