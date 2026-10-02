# Parecer de boas práticas

Escopo analisado: `backend/src/**` e `frontend/src/**` (código de implementação). Nenhum arquivo foi alterado; as correções abaixo são apenas sugestões e preservam todos os requisitos funcionais existentes.

Critérios: **N** = nomes · **R** = responsabilidades · **D** = duplicação · **C** = complexidade de fluxo · **E** = tratamento de erros.

---

## 1. Tratamento de erros e falhas previsíveis

### E-01 — Rejeições de handlers `async` não chegam ao middleware de erro
- **Arquivo:** `backend/src/routes/admin.js`, `backend/src/routes/public.js`, `backend/src/routes/auth.js`
- **Trecho:** todos os handlers `async (req, res) => { ... }`; em especial `handleSaveError` (admin.js:15-19), que faz `throw err` dentro de um `catch` de handler assíncrono.
- **Problema:** o projeto usa Express `^4.19.2`, que **não** encaminha promessas rejeitadas para o handler de erro de `app.js:15`. Uma falha do MongoDB (conexão caída, `CastError` etc.) ou o `throw err` de `handleSaveError` vira *unhandled rejection*: a requisição fica pendurada até timeout e o processo pode ser encerrado (Node ≥ 15).
- **Por que prejudica:** o middleware de erro centralizado existe, mas é inalcançável para quase todas as rotas; o tratamento de erros é aparente, não efetivo.
- **Correção sugerida:** envolver os handlers com um wrapper `const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);` (ou usar `express-async-errors` / migrar para Express 5). Em `handleSaveError`, receber `next` e chamar `next(err)` no lugar de `throw err`.

### E-02 — IDs inválidos geram erro genérico em PUT/DELETE, mas 404 em GET
- **Arquivo:** `backend/src/routes/admin.js`
- **Trecho:** `GET /products/:id` (l.25-29) vs. `PUT /products/:id` (l.39-50) e `DELETE /products/:id` (l.52-55).
- **Problema:** o GET converte qualquer erro em 404 via `.catch(() => null)`; o PUT e o DELETE deixam o `CastError` de um ID malformado escapar (cai em E-01). Além disso, o `.catch(() => null)` do GET também mascara falhas reais de banco como "Produto não encontrado".
- **Por que prejudica:** mesma entrada inválida produz respostas diferentes por rota, e erros de infraestrutura são reportados como ausência de dado.
- **Correção sugerida:** validar o parâmetro uma única vez com `adminRouter.param("id", ...)` usando `mongoose.isValidObjectId` → 404; remover o `.catch(() => null)` para que erros reais sigam para o handler de erro.

### E-03 — Mensagem de `ValidationError` fixa e possivelmente incorreta
- **Arquivo:** `backend/src/routes/admin.js`
- **Trecho:** `handleSaveError`, l.17.
- **Problema:** qualquer `ValidationError` responde "Nome e slug são obrigatórios", mesmo quando o erro vem de outro campo (ex.: `active` com valor não booleano gera `CastError` dentro de `ValidationError`).
- **Por que prejudica:** o usuário recebe diagnóstico falso.
- **Correção sugerida:** montar a mensagem a partir de `Object.values(err.errors).map((e) => e.message)`, ou declarar mensagens no schema (`required: [true, "Nome é obrigatório"]`) e repassá-las.

### E-04 — `checkPassword` lança exceção com hash malformado
- **Arquivo:** `backend/src/models/Admin.js`
- **Trecho:** `adminSchema.methods.checkPassword`, l.14-18.
- **Problema:** se `passwordHash` não tiver o formato `salt:hash` de 64 bytes, `crypto.timingSafeEqual` lança `RangeError` (tamanhos diferentes) em vez de retornar `false`; combinado com E-01, o login trava.
- **Por que prejudica:** falha previsível de dado transforma-se em erro não tratado no fluxo de autenticação.
- **Correção sugerida:** verificar `salt && hash` e comparar `candidate.length === expected.length` antes do `timingSafeEqual`, retornando `false` caso contrário.

### E-05 — Normalização de e-mail inconsistente entre login e modelo
- **Arquivo:** `backend/src/routes/auth.js` (l.9) e `backend/src/models/Admin.js` (l.5)
- **Problema:** o login aplica `toLowerCase()` ao e-mail, mas o schema não aplica `lowercase: true`/`trim: true`. Um admin cadastrado com maiúsculas nunca conseguiria logar.
- **Por que prejudica:** a regra de normalização está espalhada e só metade dela é garantida.
- **Correção sugerida:** declarar `lowercase: true, trim: true` no campo `email` do schema; manter o `toLowerCase()` do login (ou usar `.trim().toLowerCase()`).

### E-06 — Conexão com o banco sem tratamento no start
- **Arquivo:** `backend/src/server.js` (l.5) e `backend/src/seed.js` (l.7-28)
- **Problema:** `await mongoose.connect(...)` de top-level sem `try/catch`; falha de conexão gera stack trace cru. No seed, uma falha no meio deixa a conexão aberta (sem `finally`).
- **Por que prejudica:** falha comum de ambiente (Mongo desligado) não produz mensagem clara nem encerramento controlado.
- **Correção sugerida:** envolver em `try/catch` com mensagem objetiva e `process.exit(1)`; no seed, `try { ... } finally { await mongoose.disconnect(); }`.

### E-07 — Sessão expirada (401) tratada apenas em uma tela
- **Arquivo:** `frontend/src/pages/AdminProducts.jsx` (`run`, l.13-25) vs. `frontend/src/pages/AdminProductForm.jsx` (l.24, 34-43) e `frontend/src/components/SettingsForm.jsx` (l.16, 19-27)
- **Problema:** só as ações de toggle/excluir em `AdminProducts` limpam o token e redirecionam no 401. O carregamento da lista (`useAsync(api.adminGetProducts)`), o formulário de produto e o de configurações apenas exibem "Não autorizado", deixando o usuário preso em telas protegidas com token inválido.
- **Por que prejudica:** o mesmo erro previsível tem tratamento diferente conforme o ponto de chamada.
- **Correção sugerida:** centralizar no `request` de `api.js`: ao receber 401 em rota `/admin/*`, chamar `clearToken()` e disparar um evento/callback (ex.: `onUnauthorized`) que o `RequireAdmin`/`AdminLayout` usa para navegar ao login. Remover o ramo específico de `run`.

### E-08 — Falha ao carregar produto em edição deixa formulário vazio submetível
- **Arquivo:** `frontend/src/pages/AdminProductForm.jsx`
- **Trecho:** `useEffect`, l.23-25.
- **Problema:** se `adminGetProduct` falhar (404, rede), o formulário continua exibindo `EMPTY` editável; ao salvar, envia um PUT com dados em branco para o `id`.
- **Por que prejudica:** estado de erro não bloqueia a ação dependente dele.
- **Correção sugerida:** manter um estado `loaded`/`loadError` e, em modo edição, renderizar só a mensagem (ou desabilitar o botão "Salvar") enquanto o produto não tiver sido carregado com sucesso.

### E-09 — Erros distintos colapsados em "Produto não encontrado" e falha de settings ignorada
- **Arquivo:** `frontend/src/pages/ProductDetail.jsx`, l.11-27
- **Problema:** qualquer `product.error` (inclusive falha de rede/500) mostra "Produto não encontrado". Já `settings.error` é ignorado e o botão de WhatsApp é gerado com número vazio (`https://wa.me/?text=...`).
- **Por que prejudica:** mensagem enganosa e link quebrado silencioso.
- **Correção sugerida:** diferenciar `product.error.status === 404` dos demais erros ("Erro ao carregar produto"); tratar `settings.error` (ex.: mensagem de indisponibilidade do contato ou ocultar/desabilitar o botão quando não houver número).

### E-10 — `request` assume corpo vazio só para 204
- **Arquivo:** `frontend/src/api.js`, l.13-21
- **Problema:** uma falha de rede (`fetch` rejeita com `TypeError: Failed to fetch`) chega à UI com mensagem técnica em inglês; respostas não-JSON com `ok` retornam `{}` silenciosamente.
- **Por que prejudica:** mensagens de erro inconsistentes para o usuário.
- **Correção sugerida:** envolver o `fetch` em `try/catch` e lançar `Error("Falha de conexão com o servidor")`; tratar o caso `res.ok` com corpo inválido como erro.

---

## 2. Clareza e precisão de nomes

### N-01 — `AdminProducts` também é a página de configurações
- **Arquivo:** `frontend/src/pages/AdminProducts.jsx`, l.69-70
- **Problema:** o componente nomeado como listagem de produtos renderiza também `SettingsForm`.
- **Por que prejudica:** quem procura a tela de configurações não a encontra pelo nome.
- **Correção sugerida:** renomear para `AdminDashboard` (mantendo a rota `/admin`) ou extrair uma seção `AdminSettingsSection`, deixando `AdminProducts` só com a tabela.

### N-02 — Nomes genéricos: `set`, `run`, `p`, `x`, `FIELDS`, `EMPTY`
- **Arquivos/trechos:** `AdminProductForm.jsx` `set` (l.27), `EMPTY` (l.6); `AdminProducts.jsx` `run` (l.13), `p`/`x` (l.27-37, 51); `Home.jsx`/`ProductDetail.jsx` `p`; `SettingsForm.jsx` `FIELDS` (l.4).
- **Problema:** `set` colide semanticamente com `setProduct`/`Set`; `run` não diz que trata erros/401; `p`/`x` reduzem legibilidade em callbacks aninhados.
- **Correção sugerida:** `set` → `handleFieldChange`; `run` → `runWithErrorHandling`; `p` → `product`, `x` → `item`; `EMPTY` → `EMPTY_PRODUCT`; `FIELDS` → `SETTINGS_FIELDS`.

### N-03 — Utilitários em pasta `components`
- **Arquivo:** `frontend/src/components/useAsync.js`, `frontend/src/components/whatsapp.js`
- **Problema:** um hook e uma função pura vivem em `components/`, que sugere componentes visuais.
- **Correção sugerida:** mover para `src/hooks/useAsync.js` e `src/utils/whatsapp.js`.

### N-04 — `requireAdmin` não verifica "admin", apenas um JWT válido; `toggle`/`remove` sem sufixo de entidade
- **Arquivo:** `backend/src/middleware/auth.js` (l.8); `AdminProducts.jsx` (l.27, 33)
- **Problema:** o nome promete mais do que o código garante (não confere se `sub` existe em `Admin`). `toggle`/`remove` são ambíguos numa tela que também tem configurações.
- **Correção sugerida:** renomear para `requireAuthToken` ou documentar a regra no próprio nome; `toggle` → `toggleProductActive`, `remove` → `deleteProduct`.

---

## 3. Separação de responsabilidades

### R-01 — Roteador admin mistura produtos e configurações e concentra helpers genéricos
- **Arquivo:** `backend/src/routes/admin.js`
- **Trecho:** `pick` (l.12-13), `handleSaveError` (l.15-19), rotas de produto (l.21-55) e de settings (l.57-64).
- **Problema:** utilitários genéricos e o mapeamento de erros de persistência estão acoplados a um arquivo de rotas que atende dois recursos.
- **Correção sugerida:** separar em `routes/adminProducts.js` e `routes/adminSettings.js`; mover `pick` para `utils/` e o mapeamento de erros de Mongo para o middleware de erro de `app.js` (11000 → 409, `ValidationError` → 400), eliminando `try/catch` por rota.

### R-02 — Lógica de "settings singleton" dividida entre modelo e rota
- **Arquivo:** `backend/src/models/Settings.js` (`getSettings`, l.12-14) e `backend/src/routes/admin.js` (l.61-64)
- **Problema:** a leitura do singleton está no modelo, mas a atualização (buscar → `findByIdAndUpdate`) está na rota, com duas idas ao banco.
- **Correção sugerida:** criar `updateSettings(fields)` no módulo do modelo (`Settings.findOneAndUpdate({}, fields, { new: true, upsert: true })`) e a rota apenas chamá-la.

### R-03 — `AdminProductForm` mistura geração de slug, estado e layout
- **Arquivo:** `frontend/src/pages/AdminProductForm.jsx`
- **Problema:** `slugify` (l.8-14) é utilitário puro definido dentro da página; a regra "slug acompanha nome até ser editado manualmente" está espalhada entre `slugEdited`, `changeName` e o `onChange` inline do slug (l.57-60).
- **Correção sugerida:** mover `slugify` para `utils/slug.js`; criar `handleSlugChange` nomeado ao lado de `changeName`, concentrando a regra.

---

## 4. Repetição / duplicação

### D-01 — Lista de campos de produto definida três vezes
- **Arquivos:** `backend/src/models/Product.js` (schema), `backend/src/routes/admin.js` (`PRODUCT_FIELDS`, l.9), `frontend/src/pages/AdminProductForm.jsx` (`EMPTY`, l.6). Idem para settings: `Settings.js`, `SETTINGS_FIELDS` (admin.js:10), `FIELDS` (SettingsForm.jsx:4).
- **Problema:** adicionar/renomear campo exige alterar vários lugares sem garantia de consistência.
- **Correção sugerida:** no backend, derivar a whitelist do schema (`Object.keys(productSchema.paths)` filtrando `_id`, `__v`, `createdAt`, `updatedAt`) e exportá-la do modelo. No frontend, manter uma única constante por entidade.

### D-02 — Blocos `<label><input data-testid ... onChange={set(...)}/></label>` repetidos
- **Arquivo:** `frontend/src/pages/AdminProductForm.jsx`, l.64-79
- **Problema:** quatro campos de texto quase idênticos; `SettingsForm` já resolve o mesmo padrão com um array de `[chave, rótulo]`.
- **Correção sugerida:** criar um componente `TextField({ label, testId, ...inputProps })` ou mapear um array de definições, preservando os `data-testid` atuais.

### D-03 — Estados de carregamento/erro reimplementados por tela
- **Arquivos:** `Home.jsx` (l.9-10), `ProductDetail.jsx` (l.11-12), `AdminProducts.jsx` (l.42-44), `SettingsForm.jsx` (l.12-17, 29), `AdminProductForm.jsx` (l.23-25)
- **Problema:** `useAsync` existe, mas `SettingsForm` e `AdminProductForm` refazem manualmente `useEffect` + `then/catch`; mensagens "Carregando..." e `<p className="error">` repetidas.
- **Correção sugerida:** usar `useAsync` também nos dois formulários (com `setData` para edição) e extrair um componente `AsyncStatus`/`ErrorMessage` para o markup repetido.

### D-04 — Busca + 404 de produto repetida nas rotas
- **Arquivos:** `backend/src/routes/admin.js` (l.26-27, 45) e `backend/src/routes/public.js` (l.16-17)
- **Problema:** `if (!product) return res.status(404).json({ error: "Produto não encontrado" })` repetido três vezes.
- **Correção sugerida:** helper `sendNotFound(res)` ou constante de mensagem; combinado com E-02/R-01, um `NotFoundError` tratado no middleware central.

---

## 5. Complexidade de fluxo e excesso de condicionais/aninhamentos

### C-01 — Spread condicional em `changeName`
- **Arquivo:** `frontend/src/pages/AdminProductForm.jsx`, l.29-32
- **Problema:** `...(slugEdited ? {} : { slug: slugify(name) })` comprime uma regra de negócio numa expressão difícil de ler.
- **Correção sugerida:** `const next = { ...product, name }; if (!slugEdited) next.slug = slugify(name); setProduct(next);` — e usar a forma funcional `setProduct((prev) => ...)` para evitar estado obsoleto.

### C-02 — `useAsync` com dependências implícitas
- **Arquivo:** `frontend/src/components/useAsync.js`, l.4-16
- **Problema:** `load` não entra no array de dependências (`deps` é passado de fora), então o efeito depende de o chamador lembrar de listar tudo o que `load` captura (ex.: `[slug]` em `ProductDetail`). `setData` é recriado a cada render.
- **Correção sugerida:** documentar a exigência no comentário do hook ou guardar `load` em `useRef`; envolver `setData` em `useCallback`.

### C-03 — `remove` executa `confirm` dentro do wrapper de erro
- **Arquivo:** `frontend/src/pages/AdminProducts.jsx`, l.33-38
- **Problema:** a confirmação do usuário (fluxo de UI) fica aninhada dentro de `run`, que limpa a mensagem de erro mesmo quando o usuário cancela.
- **Correção sugerida:** fazer o `window.confirm` antes de chamar `run`: `if (!window.confirm(...)) return; run(async () => { ... })`.

Fora desses pontos, nenhum problema relevante de aninhamento excessivo foi identificado: as funções são curtas e os condicionais têm, no máximo, dois níveis.
