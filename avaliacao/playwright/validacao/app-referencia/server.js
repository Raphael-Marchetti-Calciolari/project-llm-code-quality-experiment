// Servidor de referência: páginas em :5173 e API em :3000/api.
// MUTANTE=<nome> introduz uma falha deliberada para verificar que a suíte a rejeita.
const http = require('node:http');
const crypto = require('node:crypto');
const { ObjectId } = require('mongodb');
const { db } = require('./db');

const MUTANTE = process.env.MUTANTE || '';
// VARIANTE=controles-alternativos: <select> para ativo e <button> com window.open (comportamento correto).
const ALT = process.env.VARIANTE === 'controles-alternativos';
const sessoes = new Set();
const products = () => db.collection('products');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => `&#${ch.charCodeAt(0)};`);

const pagina = (corpo) => `<!doctype html><meta charset="utf-8"><body>${corpo}</body>`;
const enviar = (res, status, html, headers = {}) => {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', ...headers });
  res.end(html);
};
const redirecionar = (res, to, headers = {}) => { res.writeHead(303, { Location: to, ...headers }); res.end(); };

function lerForm(req) {
  return new Promise((resolve) => {
    let b = '';
    req.on('data', (d) => { b += d; });
    req.on('end', () => resolve(Object.fromEntries(new URLSearchParams(b))));
  });
}
const autenticado = (req) => sessoes.has((req.headers.cookie || '').match(/sid=([a-f0-9]+)/)?.[1]);

function formulario(acao, p = {}) {
  const campo = (id, nome, valor, tag = 'input') => tag === 'textarea'
    ? `<label>${nome}<textarea data-testid="${id}" name="${nome}">${esc(valor)}</textarea></label>`
    : `<label>${nome}<input data-testid="${id}" name="${nome}" value="${esc(valor)}"></label>`;
  return pagina(`<form method="post" action="${acao}">
    ${campo('product-name', 'name', p.name)}
    ${campo('product-slug', 'slug', p.slug)}
    ${campo('product-short-description', 'shortDescription', p.shortDescription)}
    ${campo('product-description', 'description', p.description, 'textarea')}
    ${campo('product-price', 'price', p.price)}
    ${campo('product-image-url', 'imageUrl', p.imageUrl)}
    ${ALT
    ? `<select data-testid="product-active" name="active"><option value="on" ${p.active === false ? '' : 'selected'}>Ativo</option><option value="off" ${p.active === false ? 'selected' : ''}>Inativo</option></select>`
    : `<label>Ativo<input type="checkbox" data-testid="product-active" name="active" ${p.active === false ? '' : 'checked'}></label>`}
    <button data-testid="product-save">Salvar</button></form>`);
}

const dadosForm = (f) => ({
  name: f.name, slug: f.slug, shortDescription: f.shortDescription, description: f.description,
  price: f.price, imageUrl: f.imageUrl, active: f.active === 'on',
});

async function frontend(req, res) {
  const { pathname } = new URL(req.url, 'http://x');
  const s = await db.collection('settings').findOne({});

  if (req.method === 'GET' && pathname === '/') {
    const filtro = MUTANTE === 'inativo-na-vitrine' ? {} : { active: true };
    const cards = (await products().find(filtro).toArray()).map((p) =>
      `<a data-testid="public-product-card-${esc(p.slug)}" href="/produtos/${esc(p.slug)}">${esc(p.name)} — ${esc(p.price)}</a>`);
    return enviar(res, 200, pagina(`<h1>${esc(s.storeName)}</h1><h2>${esc(s.title)}</h2><p>${esc(s.subtitle)}</p>${cards.join('')}`));
  }

  const det = pathname.match(/^\/produtos\/([^/]+)$/);
  if (req.method === 'GET' && det) {
    const p = await products().findOne({ slug: det[1], active: true });
    if (!p) return enviar(res, 404, pagina('Não encontrado'));
    const numero = MUTANTE === 'whatsapp-numero-errado' ? '5511888888888' : s.whatsapp;
    return enviar(res, 200, pagina(`<div data-testid="product-detail"><h1>${esc(p.name)}</h1>
      <img src="${esc(p.imageUrl)}" alt=""><p>${esc(p.description)}</p><p>${esc(p.price)}</p>
      ${ALT
    ? `<button data-testid="whatsapp-button" onclick="window.open('https://api.whatsapp.com/send?phone=${numero}')">WhatsApp</button>`
    : `<a data-testid="whatsapp-button" href="https://wa.me/${numero}?text=${encodeURIComponent(p.name)}">WhatsApp</a>`}</div>`));
  }

  if (pathname === '/admin/login') {
    if (req.method === 'GET') {
      return enviar(res, 200, pagina(`<form method="post"><input data-testid="login-email" name="email">
        <input data-testid="login-password" name="password" type="password">
        <button data-testid="login-submit">Entrar</button></form>`));
    }
    const f = await lerForm(req);
    const ok = f.email === 'admin@teste.local' && (f.password === 'admin123' || MUTANTE === 'login-aceita-qualquer');
    if (!ok) return enviar(res, 401, pagina('Credenciais inválidas'));
    const sid = crypto.randomBytes(16).toString('hex');
    sessoes.add(sid);
    return redirecionar(res, '/admin', { 'Set-Cookie': `sid=${sid}; Path=/; HttpOnly` });
  }

  if (pathname.startsWith('/admin')) {
    if (!autenticado(req)) return redirecionar(res, '/admin/login');

    if (req.method === 'GET' && pathname === '/admin') {
      const linhas = (await products().find().toArray()).map((p) => `<tr data-testid="admin-product-row-${esc(p.slug)}">
        <td>${esc(p.name)}</td><td>${p.active ? 'Ativo' : 'Inativo'}</td>
        <td><a data-testid="product-edit-${esc(p.slug)}" href="/admin/produtos/${p._id}/editar">Editar</a></td>
        <td><form method="post" action="/admin/produtos/${p._id}/alternar">
          <button data-testid="product-toggle-active-${esc(p.slug)}">${p.active ? 'Inativar' : 'Ativar'}</button></form></td></tr>`);
      return enviar(res, 200, pagina(`<table>${linhas.join('')}</table>`));
    }
    if (pathname === '/admin/produtos/novo') {
      if (req.method === 'GET') return enviar(res, 200, formulario('/admin/produtos/novo'));
      const dados = dadosForm(await lerForm(req));
      if (MUTANTE !== 'nao-persiste-criacao') await products().insertOne(dados);
      return redirecionar(res, '/admin');
    }
    const ed = pathname.match(/^\/admin\/produtos\/([a-f0-9]{24})\/(editar|alternar)$/);
    if (ed) {
      const _id = new ObjectId(ed[1]);
      const p = await products().findOne({ _id });
      if (!p) return enviar(res, 404, pagina('Não encontrado'));
      if (ed[2] === 'alternar' && req.method === 'POST') {
        await products().updateOne({ _id }, { $set: { active: !p.active } });
        return redirecionar(res, '/admin');
      }
      if (req.method === 'GET') return enviar(res, 200, formulario(`/admin/produtos/${ed[1]}/editar`, p));
      const dados = dadosForm(await lerForm(req));
      if (MUTANTE === 'edicao-ignora-preco') dados.price = p.price;
      await products().updateOne({ _id }, { $set: dados });
      return redirecionar(res, '/admin');
    }
  }
  return enviar(res, 404, pagina('Não encontrado'));
}

http.createServer((req, res) => frontend(req, res).catch((e) => enviar(res, 500, pagina(esc(e.message)))))
  .listen(5173, '127.0.0.1');
http.createServer((req, res) => {
  res.writeHead(req.url.startsWith('/api') ? 200 : 404, { 'Content-Type': 'application/json' });
  res.end('{"ok":true}');
}).listen(3000, '127.0.0.1');
console.log(`referência em :5173 e :3000/api${MUTANTE ? ` (MUTANTE=${MUTANTE})` : ''}`);
