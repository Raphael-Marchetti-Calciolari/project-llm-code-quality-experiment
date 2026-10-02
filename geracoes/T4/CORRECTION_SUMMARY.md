# Resumo das correções

## Apontamentos aplicados
- **N1** – `useFetch` desestruturado em `data/error/loading` com nomes de entidade (`Home`, `ProductDetail`, `AdminProductEdit`); removido `p`.
- **N2/C1** – `saveHandling` substituído por `try/catch` linear com `isDuplicateKey`/`conflict`.
- **N3** – `run` → `runAndReload`; `p` → `product`.
- **N4** – `set` → `handleChange`.
- **N5** – `text` → `trimmedString`.
- **R1** – `STORE_ID` movido para `server/src/store.js`.
- **R2** – `ADMIN_SEED` movido para `seed.js`.
- **R3** – `routes/products-dto.js` → `server/src/dto.js` com `toProductDto` e `toStoreDto` (usado em `public.js`).
- **R4/E4** – `api.js` anexa `status` ao erro e dispara o evento `admin-unauthorized` em 401; `AdminLayout` redireciona ao login em um único ponto (removida a comparação por texto).
- **D1/D5/C2** – `routes/shared.js` com `productNotFound` e `PRODUCT_SORT`; guardas `if (!x) return ...` padronizadas.
- **D2** – `updateProduct` extraído (PUT e PATCH).
- **D3** – hook `useSubmit` e componente `ErrorMessage` (ProductForm, AdminLogin, AdminStore, AdminProducts).
- **D4/E3** – `useFetch` ganhou `reload`; `AdminProducts` e `AdminStore` o utilizam (AdminStore agora trata erro de carregamento).
- **D6** – componente `Loading`.
- **C3** – confirmação de exclusão antes da requisição/recarga.
- **C4** – JSX de `AdminStore`/`ProductDetail` simplificado (mensagem de sucesso/erro separada, JSX quebrado em linhas).
- **E1** – middleware de erro respeita status 4xx (400 `JSON inválido`).
- **E2** – `api.js` trata falha de rede e corpo não-JSON com mensagens amigáveis.
- **E5** – `ProductDetail` diferencia 404 de outras falhas e só exibe o botão de WhatsApp quando há número.
- **E6** – login valida e-mail/senha como strings não vazias (400) antes de consultar o banco.
- **E7** – `connectOrExit` com mensagem clara e `exit(1)` em `index.js`/`seed.js`; `seed.js` usa `try/finally` para `client.close()`.
- **E8** – `encodeURIComponent` em slug/id nos caminhos da API.

## Não aplicados
Nenhum integralmente. Observações: em E5, o erro de `store` não é exibido como mensagem; apenas o botão é ocultado sem número, para preservar o layout existente.

## Arquivos alterados
Servidor: `app.js`, `config.js`, `db.js`, `index.js`, `seed.js`, `validation.js`, `routes/admin.js`, `routes/public.js`; novos `store.js`, `dto.js`, `routes/shared.js`; removido `routes/products-dto.js`.
Cliente: `api.js`, `useFetch.js`, `components/AdminLayout.jsx`, `components/ProductForm.jsx`, `pages/{AdminLogin,AdminProductEdit,AdminProducts,AdminStore,Home,ProductDetail}.jsx`; novos `useSubmit.js`, `components/ErrorMessage.jsx`, `components/Loading.jsx`.

## Validação
- `npm install` – ok.
- `npm test` – servidor: 14 passam, 0 falham; cliente (vitest): 7 passam, 0 falham.
- `npm run build` – sucesso.
