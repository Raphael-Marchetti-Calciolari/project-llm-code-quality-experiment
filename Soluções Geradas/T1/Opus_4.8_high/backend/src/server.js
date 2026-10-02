import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { config } from './config/env.js';

/**
 * Ponto de entrada do servidor: conecta ao banco e inicia o HTTP.
 */
async function start() {
  try {
    await connectDatabase();
    const app = createApp();
    app.listen(config.port, () => {
      console.log(`Servidor rodando em http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error.message);
    process.exit(1);
  }
}

start();
