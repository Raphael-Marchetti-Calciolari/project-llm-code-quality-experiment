// Suíte funcional comum — cenários de aceitação P1–P5 (um teste por cenário).
const { test, expect } = require('@playwright/test');
const c = require('./contrato');

test.beforeEach(async ({ context, page }) => {
  c.resetDb();
  await c.servirImagensDeTeste(context);
  c.aceitarDialogos(context, page);
});

test('P1 — Autenticação administrativa', async ({ browser }) => {
  // Credenciais válidas, em sessão limpa: acesso ao painel com a listagem administrativa.
  const valida = await browser.newContext();
  const p1 = await valida.newPage();
  await c.login(p1, c.CREDENCIAIS);
  await c.abrirPainel(p1);
  await expect(p1.getByTestId(`admin-product-row-${c.FIXTURE.slug}`)).toBeVisible();
  await valida.close();

  // Credenciais inválidas, em outra sessão limpa: o painel não é acessível.
  const invalida = await browser.newContext();
  const p2 = await invalida.newPage();
  await c.login(p2, { email: c.CREDENCIAIS.email, senha: 'senha-incorreta' });
  await p2.goto(c.url('/admin'));
  await c.settle(p2);
  await expect(p2.getByTestId(`admin-product-row-${c.FIXTURE.slug}`)).toHaveCount(0);
  await invalida.close();
});

test('P2 — Cadastro e publicação', async ({ page }) => {
  const novo = {
    nome: 'Produto Cenário P2',
    slug: 'produto-cenario-p2',
    descricaoCurta: 'Resumo do produto P2',
    descricao: 'Descrição completa do produto cadastrado no cenário P2',
    preco: 'R$ 25,90',
    imagem: 'https://example.com/tcc/p2.png',
    ativo: true,
  };

  await c.login(page, c.CREDENCIAIS);
  await page.goto(c.url('/admin/produtos/novo'));
  await c.settle(page);
  await c.preencherProduto(page, novo);
  await c.salvarProduto(page);

  // Listagem pública, após recarregar.
  await page.goto(c.url('/'));
  await page.reload();
  await c.settle(page);
  await expect(page.getByTestId(`public-product-card-${novo.slug}`)).toContainText(novo.nome);

  // Página de detalhes, após recarregar.
  await page.goto(c.url(`/produtos/${novo.slug}`));
  await page.reload();
  await c.settle(page);
  await expect(page.getByTestId('product-detail')).toContainText(novo.nome);

  // Todos os valores informados persistidos.
  await c.conferirFormulario(page, novo.slug, novo);
});

test('P3 — Edição de produto', async ({ page }) => {
  const editado = {
    nome: 'Produto Fixture Editado',
    slug: c.FIXTURE.slug, // identificador mantido
    descricaoCurta: 'Resumo editado no cenário P3',
    descricao: 'Descrição completa editada no cenário P3',
    preco: 'R$ 99,90',
    imagem: 'https://example.com/tcc/p3.png',
    ativo: true,
  };

  await c.login(page, c.CREDENCIAIS);
  await c.abrirPainel(page);
  await page.getByTestId(`product-edit-${c.FIXTURE.slug}`).click();
  await c.settle(page);
  await expect(page.getByTestId('product-name')).toHaveValue(c.FIXTURE.nome);
  await c.preencherProduto(page, { ...editado, slug: undefined, ativo: undefined });
  await c.salvarProduto(page);

  // Vitrine apresenta os novos valores após recarregamento.
  await page.goto(c.url('/'));
  await page.reload();
  await c.settle(page);
  await expect(page.getByTestId(`public-product-card-${c.FIXTURE.slug}`)).toContainText(editado.nome);

  await page.goto(c.url(`/produtos/${c.FIXTURE.slug}`));
  await page.reload();
  await c.settle(page);
  await expect(page.getByTestId('product-detail')).toContainText(editado.nome);

  await c.conferirFormulario(page, c.FIXTURE.slug, editado);
});

test('P4 — Inativação', async ({ page }) => {
  // Pré-condição: o produto ativo do seed aparece na vitrine.
  await page.goto(c.url('/'));
  await c.settle(page);
  await expect(page.getByTestId(`public-product-card-${c.FIXTURE.slug}`)).toBeVisible();

  await c.login(page, c.CREDENCIAIS);
  await c.abrirPainel(page);
  await c.acionarEscrita(page, page.getByTestId(`product-toggle-active-${c.FIXTURE.slug}`));

  // Ausente na listagem pública de ativos.
  await page.goto(c.url('/'));
  await page.reload();
  await c.settle(page);
  await expect(page.getByTestId(`public-product-card-${c.FIXTURE.slug}`)).toHaveCount(0);

  // Registro preservado na administração, com estado inativo.
  await page.goto(c.url('/admin'));
  await c.settle(page);
  await expect(page.getByTestId(`admin-product-row-${c.FIXTURE.slug}`)).toBeVisible();
  await page.getByTestId(`product-edit-${c.FIXTURE.slug}`).click();
  await c.settle(page);
  expect(await c.lerAtivo(page)).toBe(false);
});

test('P5 — Contato via WhatsApp', async ({ page, context }) => {
  // Nenhuma requisição chega ao WhatsApp: destinos são interceptados e respondidos localmente.
  const capturados = [];
  await context.route(/^https?:\/\/([^/]*\.)?(wa\.me|whatsapp\.com)\//, (route) => {
    capturados.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<html></html>' });
  });
  await context.addInitScript(() => {
    window.__tccAbertos = [];
    const abrir = window.open;
    window.open = (u, ...r) => { window.__tccAbertos.push(String(u)); return abrir.call(window, u, ...r); };
  });

  await page.goto(c.url(`/produtos/${c.FIXTURE.slug}`));
  await c.settle(page);
  const botao = page.getByTestId('whatsapp-button');
  await expect(botao).toBeVisible();

  let destino = await botao.evaluate((e) =>
    e.closest('a[href]')?.href ?? e.querySelector('a[href]')?.href ?? e.getAttribute('href'));
  if (!destino) {
    const popup = page.waitForEvent('popup', { timeout: 5_000 }).catch(() => null);
    await botao.click();
    await popup;
    await page.waitForTimeout(500);
    const abertos = await page.evaluate(() => window.__tccAbertos || []).catch(() => []);
    destino = abertos[0] || capturados[0] || null;
  }
  expect(destino, 'botão sem destino identificável').toBeTruthy();

  const alvo = new URL(destino);
  const host = alvo.hostname.replace(/^www\./, '');
  let numero;
  if (host === 'wa.me') numero = alvo.pathname.replace(/\//g, '');
  else if (['api.whatsapp.com', 'web.whatsapp.com', 'whatsapp.com'].includes(host)) numero = alvo.searchParams.get('phone');
  else if (alvo.protocol === 'whatsapp:') numero = alvo.searchParams.get('phone');
  expect(numero, `destino não é WhatsApp: ${destino}`).toBeTruthy();
  expect(numero.replace(/\D/g, '')).toBe(c.WHATSAPP);
});
