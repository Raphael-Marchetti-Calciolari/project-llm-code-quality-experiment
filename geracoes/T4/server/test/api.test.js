import test, { before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { connect } from '../src/db.js';
import { createApp } from '../src/app.js';
import { seed } from '../src/seed.js';

let client, db, server, base, token;

const api = async (path, { method = 'GET', body, auth } = {}) => {
  const res = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: res.status === 204 ? null : await res.json() };
};

const newProduct = (over = {}) => ({
  name: 'Camiseta Azul',
  shortDescription: 'Curta',
  description: 'Completa',
  price: 'R$ 50,00',
  imageUrl: 'https://example.com/a.png',
  active: true,
  ...over,
});

before(async () => {
  ({ client, db } = await connect('mongodb://127.0.0.1:27017/tcc_catalog_test'));
  server = createApp(db).listen(0);
  base = `http://127.0.0.1:${server.address().port}/api`;
});

beforeEach(async () => {
  await seed(db, { reset: true });
  token = (await api('/admin/login', { method: 'POST', body: { email: 'admin@teste.local', password: 'admin123' } })).body.token;
});

after(async () => {
  server.close();
  await client.close();
});

test('seed cria loja e produto fixture e é idempotente', async () => {
  await seed(db);
  const store = (await api('/store')).body;
  assert.equal(store.whatsapp, '5511999999999');
  const { body } = await api('/products');
  assert.equal(body.length, 1);
  assert.equal(body[0].slug, 'produto-fixture');
  assert.equal(body[0].price, 'R$ 10,00');
});

test('login rejeita credenciais inválidas e aceita válidas', async () => {
  const bad = await api('/admin/login', { method: 'POST', body: { email: 'admin@teste.local', password: 'x' } });
  assert.equal(bad.status, 401);
  assert.ok(token);
});

test('rotas administrativas exigem token', async () => {
  assert.equal((await api('/admin/products')).status, 401);
  assert.equal((await api('/admin/store', { method: 'PUT', body: {} })).status, 401);
});

test('detalhe público retorna produto ativo e 404 para inativo ou inexistente', async () => {
  assert.equal((await api('/products/produto-fixture')).body.name, 'Produto Fixture');
  const created = (await api('/admin/products', { method: 'POST', auth: token, body: newProduct({ active: false }) })).body;
  assert.equal((await api(`/products/${created.slug}`)).status, 404);
  assert.equal((await api('/products/nao-existe')).status, 404);
});

test('criar produto gera slug a partir do nome quando omitido', async () => {
  const res = await api('/admin/products', { method: 'POST', auth: token, body: newProduct() });
  assert.equal(res.status, 201);
  assert.equal(res.body.slug, 'camiseta-azul');
  assert.ok(res.body.id);
});

test('criar produto valida campos obrigatórios e slug único', async () => {
  const invalid = await api('/admin/products', { method: 'POST', auth: token, body: newProduct({ name: '' }) });
  assert.equal(invalid.status, 400);
  const dup = await api('/admin/products', { method: 'POST', auth: token, body: newProduct({ slug: 'produto-fixture' }) });
  assert.equal(dup.status, 409);
});

test('editar produto atualiza campos e mantém unicidade do slug', async () => {
  const p = (await api('/admin/products', { method: 'POST', auth: token, body: newProduct() })).body;
  const ok = await api(`/admin/products/${p.id}`, { method: 'PUT', auth: token, body: newProduct({ slug: 'camiseta-azul', price: 'R$ 60,00' }) });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.price, 'R$ 60,00');
  const dup = await api(`/admin/products/${p.id}`, { method: 'PUT', auth: token, body: newProduct({ slug: 'produto-fixture' }) });
  assert.equal(dup.status, 409);
  assert.equal((await api('/admin/products/000000000000000000000000', { method: 'PUT', auth: token, body: newProduct() })).status, 404);
});

test('ativar/inativar altera visibilidade pública', async () => {
  const list = (await api('/admin/products', { auth: token })).body;
  const fixture = list.find((p) => p.slug === 'produto-fixture');
  const res = await api(`/admin/products/${fixture.id}/active`, { method: 'PATCH', auth: token, body: { active: false } });
  assert.equal(res.body.active, false);
  assert.equal((await api('/products')).body.length, 0);
  assert.equal((await api('/admin/products', { auth: token })).body.length, 1);
});

test('excluir produto remove do banco', async () => {
  const [fixture] = (await api('/admin/products', { auth: token })).body;
  assert.equal((await api(`/admin/products/${fixture.id}`, { method: 'DELETE', auth: token })).status, 204);
  assert.equal((await api('/admin/products', { auth: token })).body.length, 0);
  assert.equal((await api(`/admin/products/${fixture.id}`, { method: 'DELETE', auth: token })).status, 404);
});

test('configurações da vitrine podem ser editadas e validadas', async () => {
  const data = { storeName: 'Loja X', headline: 'Título', subtitle: 'Sub', whatsapp: '5511988887777' };
  const res = await api('/admin/store', { method: 'PUT', auth: token, body: data });
  assert.equal(res.status, 200);
  assert.deepEqual((await api('/store')).body, data);
  const bad = await api('/admin/store', { method: 'PUT', auth: token, body: { ...data, whatsapp: 'abc' } });
  assert.equal(bad.status, 400);
});
