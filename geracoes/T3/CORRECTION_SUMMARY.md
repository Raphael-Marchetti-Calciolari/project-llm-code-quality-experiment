# Resumo da correção

## Apontamentos aplicados
- **E-01** `asyncHandler` (`backend/src/utils/asyncHandler.js`) envolve todos os handlers async; erros chegam ao middleware de erro.
- **E-02** `router.param("id")` com `mongoose.isValidObjectId` → 404 em GET/PUT/DELETE; removido o `.catch(() => null)`.
- **E-03** `ValidationError` agora usa as mensagens do schema (mantido o texto "Nome e slug são obrigatórios" para name/slug).
- **E-04** `checkPassword` retorna `false` para hash malformado / tamanhos diferentes.
- **E-05** `lowercase`/`trim` no e-mail do schema; login usa `.trim().toLowerCase()`.
- **E-06** `try/catch` + `process.exit(1)` em `server.js`; `try/finally` com `disconnect` em `seed.js`.
- **E-07** 401 em rotas `/admin/*` tratado em `api.js` (limpa token + `setUnauthorizedHandler`, registrado por `RequireAdmin`); removido o ramo específico de `run`.
- **E-08** Formulário de edição só é exibido após carregar o produto; erro de carga exibe apenas a mensagem.
- **E-09** `ProductDetail` diferencia 404 de outros erros; falha em settings oculta o botão WhatsApp e mostra aviso.
- **E-10** Falha de rede → "Falha de conexão com o servidor"; resposta OK com corpo inválido vira erro.
- **N-01** `AdminProducts` → `AdminDashboard` (rota `/admin` inalterada).
- **N-02** Renomeações: `set`→`handleFieldChange`, `run`→`runWithErrorHandling`, `p`/`x`→`product`/`item`, `EMPTY`→`EMPTY_PRODUCT`, `FIELDS`→`SETTINGS_FIELDS`, `toggle`/`remove`→`toggleProductActive`/`deleteProduct`.
- **N-03** `useAsync` → `src/hooks/`; `whatsapp.js` → `src/utils/`.
- **N-04** `requireAdmin` → `requireAuthToken`.
- **R-01** `admin.js` dividido em `adminProducts.js` e `adminSettings.js`; `pick` em `utils/`; mapeamento 11000/ValidationError movido para o middleware de erro de `app.js`.
- **R-02** `updateSettings` adicionado em `models/Settings.js` (`findOneAndUpdate` com upsert).
- **R-03** `slugify` em `utils/slug.js`; regra do slug concentrada em `changeName`/`handleSlugChange`.
- **D-01** (backend) whitelists derivadas dos schemas (`PRODUCT_FIELDS`, `SETTINGS_FIELDS`).
- **D-03** `SettingsForm` e `AdminProductForm` usam `useAsync`; componente `ErrorMessage` extraído.
- **D-04** `sendProductNotFound` centraliza o 404 de produto.
- **C-01** `changeName` sem spread condicional, com updater funcional.
- **C-02** `setData` em `useCallback` (aceita updater); exigência de `deps` documentada.
- **C-03** `window.confirm` antes do wrapper de erro.

## Não aplicados / parcialmente aplicados
- **D-01 (frontend):** a lista de campos continua em `EMPTY_PRODUCT`/`SETTINGS_FIELDS`, uma constante por entidade, como o parecer permite; não há fonte compartilhada front/back sem nova infraestrutura.
- **D-02:** os campos de `AdminProductForm` não foram abstraídos em `TextField`; o risco de alterar a estrutura de labels/`data-testid` superou o ganho.
- **D-03 (parcial):** o markup "Carregando..." não virou componente `AsyncStatus`; apenas `ErrorMessage` foi extraído.

## Arquivos alterados
Backend: `app.js`, `server.js`, `seed.js`, `middleware/auth.js`, `models/{Admin,Product,Settings}.js`, `routes/{admin,auth,public}.js`; novos `routes/adminProducts.js`, `routes/adminSettings.js`, `utils/{asyncHandler,pick,notFound}.js`.
Frontend: `App.jsx`, `api.js`, `components/{RequireAdmin,SettingsForm}.jsx`, `pages/{AdminProductForm,Home,ProductDetail}.jsx`; movidos `hooks/useAsync.js`, `utils/whatsapp.js`, `pages/AdminDashboard.jsx` (ex-AdminProducts); novos `components/ErrorMessage.jsx`, `utils/slug.js`.

## Validação
- O projeto não possui testes automatizados.
- `npm install` — OK.
- `npm run build -w frontend` — OK (vite build concluído).
- `node --check` em todos os arquivos do backend — OK.
- Import de `backend/src/app.js` — OK ("app ok").
- Não foi possível executar o backend contra o MongoDB (`mongod` indisponível no ambiente), então os fluxos de API/UI não foram exercitados end-to-end.
