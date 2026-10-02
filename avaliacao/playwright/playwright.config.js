// Configuração congelada da suíte funcional comum (P1–P5).
// Idêntica para T1–T4: Chromium apenas, execução sequencial, tempos fixos, sem reexecução.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './testes',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['json', { outputFile: process.env.RELATORIO_JSON || 'relatorio.json' }],
  ],
  outputDir: process.env.ARTEFATOS_DIR || 'artefatos',
  use: {
    ...devices['Desktop Chrome'],
    headless: true,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium' }],
});
