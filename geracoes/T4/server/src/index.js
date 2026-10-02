import { connectOrExit } from './db.js';
import { createApp } from './app.js';
import { config } from './config.js';

const { db } = await connectOrExit(config.mongoUri);
createApp(db).listen(config.port, () => console.log(`API em http://localhost:${config.port}/api`));
