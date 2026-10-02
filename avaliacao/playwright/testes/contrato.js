// Valores e utilitários derivados exclusivamente da seção
// "CONTRATOS FIXOS DE EXECUÇÃO E INTERFACE" dos prompts T1/T2.
const { execSync } = require('node:child_process');
const { expect } = require('@playwright/test');

const FRONTEND = process.env.BASE_URL || 'http://localhost:5173';
const PROJECT_DIR = process.env.PROJECT_DIR;

const CREDENCIAIS = { email: 'admin@teste.local', senha: 'admin123' };
const WHATSAPP = '5511999999999';
const FIXTURE = {
  nome: 'Produto Fixture',
  slug: 'produto-fixture',
  descricaoCurta: 'Produto para testes',
  descricao: 'Descrição completa do produto para testes',
  preco: 'R$ 10,00',
};

const url = (path) => new URL(path, FRONTEND).toString();

// Preparação independente de dados: estado inicial do seed antes de cada cenário.
function resetDb() {
  if (!PROJECT_DIR) throw new Error('PROJECT_DIR não definido');
  execSync('npm run reset-db', { cwd: PROJECT_DIR, stdio: 'pipe', timeout: 60_000 });
}

// Imagens de teste servidas localmente pelo próprio Playwright (sem rede externa).
const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
);
async function servirImagensDeTeste(context) {
  await context.route('https://example.com/tcc/**', (route) =>
    route.fulfill({ status: 200, contentType: 'image/png', body: PNG_1X1 }),
  );
}

async function settle(page) {
  await page.waitForLoadState('networkidle');
}

// Login pelo formulário. Se a aplicação não redirecionar, acessa a rota /admin do contrato.
async function login(page, { email, senha }) {
  await page.goto(url('/admin/login'));
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(senha);
  await page.getByTestId('login-submit').click();
  await settle(page);
}

async function abrirPainel(page) {
  if (new URL(page.url()).pathname !== '/admin') {
    await page.goto(url('/admin'));
  }
  await settle(page);
}

// `product-active` pode ser checkbox/radio, select ou controle com aria-checked/aria-pressed.
// O mesmo tratamento é aplicado a todas as condições.
async function controleAtivo(page) {
  const el = page.getByTestId('product-active');
  const tag = await el.evaluate((e) => e.tagName.toLowerCase());
  if (tag !== 'input' && tag !== 'select') {
    const interno = el.locator('input[type="checkbox"], input[type="radio"], select');
    if ((await interno.count()) === 1) return interno;
  }
  return el;
}

const VERDADEIRO = /^(true|1|ativo|active|sim|yes|on|checked)$/i;
const FALSO = /^(false|0|inativo|inactive|não|nao|no|off|unchecked)$/i;
const ATRIBUTOS_ESTADO = ['aria-checked', 'aria-pressed', 'data-state', 'data-active', 'data-checked'];

async function definirAtivo(page, valor) {
  const el = await controleAtivo(page);
  const tag = await el.evaluate((e) => e.tagName.toLowerCase());
  const tipo = await el.getAttribute('type');
  if (tag === 'input' && (tipo === 'checkbox' || tipo === 'radio')) return el.setChecked(valor);
  if (tag === 'select') {
    const opcoes = await el.locator('option').evaluateAll((os) =>
      os.map((o) => ({ value: o.value, label: o.textContent.trim() })),
    );
    const alvo = opcoes.find((o) => (valor ? VERDADEIRO : FALSO).test(o.value) || (valor ? VERDADEIRO : FALSO).test(o.label));
    if (!alvo) throw new Error(`product-active: opção para ${valor} não encontrada`);
    return el.selectOption(alvo.value);
  }
  if ((await lerAtivo(page)) !== valor) await el.click();
}

async function lerAtivo(page) {
  const el = await controleAtivo(page);
  const tag = await el.evaluate((e) => e.tagName.toLowerCase());
  const tipo = await el.getAttribute('type');
  if (tag === 'input' && (tipo === 'checkbox' || tipo === 'radio')) return el.isChecked();
  if (tag === 'select') {
    const v = await el.evaluate((s) => [s.value, s.options[s.selectedIndex]?.textContent.trim() ?? '']);
    if (v.some((x) => VERDADEIRO.test(x))) return true;
    if (v.some((x) => FALSO.test(x))) return false;
    throw new Error(`product-active: valor não reconhecido (${v.join(' / ')})`);
  }
  for (const attr of ATRIBUTOS_ESTADO) {
    const v = await el.getAttribute(attr);
    if (v !== null && VERDADEIRO.test(v)) return true;
    if (v !== null && FALSO.test(v)) return false;
  }
  throw new Error('product-active: estado não identificável (checkbox, select, aria-* ou data-*)');
}

async function preencherProduto(page, p) {
  await page.getByTestId('product-name').fill(p.nome);
  if (p.slug !== undefined) await page.getByTestId('product-slug').fill(p.slug);
  await page.getByTestId('product-short-description').fill(p.descricaoCurta);
  await page.getByTestId('product-description').fill(p.descricao);
  await page.getByTestId('product-price').fill(p.preco);
  await page.getByTestId('product-image-url').fill(p.imagem);
  if (p.ativo !== undefined) await definirAtivo(page, p.ativo);
}

// Aciona um controle que grava dados e aguarda a resposta da requisição de escrita (não GET).
async function acionarEscrita(page, locator) {
  const escrita = page.waitForResponse((r) => r.request().method() !== 'GET', { timeout: 15_000 });
  await locator.click();
  await escrita;
  await settle(page);
}

async function salvarProduto(page) {
  await acionarEscrita(page, page.getByTestId('product-save'));
}

// Confirmações nativas (window.confirm/alert) são aceitas em todas as páginas.
function aceitarDialogos(context, page) {
  const aceitar = (p) => p.on('dialog', (d) => d.accept());
  aceitar(page);
  context.on('page', aceitar);
}

// Reabre o formulário de edição pelo painel e confere todos os campos persistidos.
async function conferirFormulario(page, slug, p) {
  await page.goto(url('/admin'));
  await settle(page);
  await page.getByTestId(`product-edit-${slug}`).click();
  await settle(page);
  await expect(page.getByTestId('product-name')).toHaveValue(p.nome);
  await expect(page.getByTestId('product-slug')).toHaveValue(p.slug);
  await expect(page.getByTestId('product-short-description')).toHaveValue(p.descricaoCurta);
  await expect(page.getByTestId('product-description')).toHaveValue(p.descricao);
  await expect(page.getByTestId('product-price')).toHaveValue(p.preco);
  await expect(page.getByTestId('product-image-url')).toHaveValue(p.imagem);
  expect(await lerAtivo(page)).toBe(p.ativo);
}

module.exports = {
  url, resetDb, servirImagensDeTeste, settle, login, abrirPainel,
  definirAtivo, lerAtivo, preencherProduto, salvarProduto, conferirFormulario,
  acionarEscrita, aceitarDialogos,
  CREDENCIAIS, WHATSAPP, FIXTURE,
};
