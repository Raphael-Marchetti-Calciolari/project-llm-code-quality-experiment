# Parecer de boas práticas

Escopo: clareza de nomes, separação de responsabilidades, duplicação, complexidade de fluxo e tratamento de erros.
Nenhum arquivo de implementação, teste ou configuração foi alterado. Os requisitos funcionais existentes devem ser preservados em todas as correções sugeridas.

## 1. Clareza e precisão de nomes

### N-01
- **Arquivo:** `server/src/routes/products-dto.js`
- **Trecho:** nome do arquivo e da função `toDto`
- **Problema:** o arquivo se chama `products-dto.js` e vive em `routes/`, mas `toDto` é só uma conversão `_id` → `id`, sem relação com rotas. O nome `toDto` não diz de quê.
- **Por quê (clareza):** o leitor precisa abrir o arquivo para saber que ele serve a produtos, e um módulo genérico dentro de `routes/` sugere responsabilidade de roteamento.
- **Correção:** renomear a função para `toProductDto` (ou `withStringId`) e mover o arquivo para fora de `routes/` (ex.: `server/src/dto.js`).

### N-02
- **Arquivo:** `client/src/pages/AdminProducts.jsx`
- **Trecho:** `run`, `toggle`, `remove`
- **Problema:** `run(action)` devolve um handler (função de ordem superior) e `toggle(p)`/`remove(p)` também devolvem handlers. Os nomes parecem executar a ação, mas apenas a preparam.
- **Por quê (clareza):** `onClick={toggle(p)}` lê como uma chamada imediata, o que confunde.
- **Correção:** `run` → `withReloadAndError`; `toggle` → `toggleActiveHandler`; `remove` → `deleteHandler`. Alternativa: tratar eventos com funções nomeadas (`handleToggle(p)`).

### N-03
- **Arquivo:** `client/src/pages/ProductDetail.jsx`
- **Trecho:** variável `p`
- **Problema:** `const p = product.data` (também `p` nos `map` de `AdminProducts` e `Home`) usa uma letra para um objeto central, enquanto `product` já é o estado do `useFetch`.
- **Por quê (clareza):** `product` (estado) e `p` (dado) se confundem no mesmo escopo.
- **Correção:** renomear `product` → `productQuery` e `p` → `product`.

### N-04
- **Arquivo:** `client/src/components/ProductForm.jsx`
- **Trecho:** função `set`
- **Problema:** `set(field)` retorna um handler de `onChange`; o nome não indica isso.
- **Por quê (clareza):** `set` sugere atribuir valor, não criar um handler.
- **Correção:** renomear para `handleChange(field)` ou `fieldChangeHandler`.

### N-05
- **Arquivo:** `server/src/routes/admin.js`
- **Trecho:** `saveHandling`, `req.filter`, parâmetro `action`
- **Problema:** `saveHandling` não descreve que converte erro de chave duplicada em 409. `req.filter` é nome genérico para um filtro de `_id`.
- **Por quê (clareza):** o nome não expressa a regra de negócio tratada.
- **Correção:** `saveHandling` → `respondConflictOnDuplicateSlug`; `req.filter` → `req.productFilter`.

### N-06
- **Arquivo:** `client/src/useFetch.js`
- **Problema:** relevante apenas de forma leve; o nome `useFetch` está adequado. Nenhum problema relevante adicional neste arquivo.

## 2. Separação de responsabilidades

### R-01
- **Arquivo:** `server/src/routes/public.js` e `server/src/routes/admin.js`
- **Trecho:** importação de `STORE_ID` de `../seed.js`
- **Problema:** rotas de produção importam uma constante de `seed.js`, módulo que também executa conexão e escrita no banco quando chamado como script (bloco `import.meta.url === ...`).
- **Por quê (responsabilidade):** o código de runtime depende de um módulo de carga de dados de desenvolvimento; um acoplamento invertido que arrasta efeitos colaterais potenciais para as rotas.
- **Correção:** mover `STORE_ID` para `config.js` (ou um `constants.js`) e importar de lá em `seed.js`, `public.js` e `admin.js`.

### R-02
- **Arquivo:** `server/src/routes/admin.js`
- **Trecho:** `router.post('/login', …)` e acesso direto a `db.collection('admins')` / `db.collection('settings')`
- **Problema:** a rota mistura autenticação (busca do admin, verificação de senha, emissão do token), acesso a coleções e montagem de resposta HTTP. O mesmo arquivo cuida de login, CRUD de produtos e configurações da loja.
- **Por quê (responsabilidade):** mudar a política de login ou a persistência da loja exige editar o mesmo arquivo do CRUD de produtos; o handler HTTP conhece o schema do Mongo.
- **Correção:** dividir em `routes/auth.js` (login), `routes/admin-products.js` e `routes/admin-store.js`; mover consultas de `settings` para um pequeno módulo `store-repository.js` compartilhado entre rota pública e admin.

### R-03
- **Arquivo:** `server/src/routes/public.js` e `admin.js`
- **Trecho:** leitura/escrita de `settings`
- **Problema:** a rota pública lê `settings` removendo `_id` manualmente; a rota admin escreve `settings` diretamente. O conhecimento da forma do documento está espalhado.
- **Por quê (responsabilidade):** mudanças no documento de configurações exigem alterar dois lugares.
- **Correção:** funções `getStore(db)` e `saveStore(db, value)` em um único módulo.

### R-04
- **Arquivo:** `client/src/pages/AdminProducts.jsx`
- **Trecho:** `load`, `run`, `toggle`, `remove` e a `<table>` no mesmo componente
- **Problema:** o componente acumula busca de dados, política de sessão expirada (`navigate('/admin/login')`), ações de mutação, confirmação (`window.confirm`) e renderização da tabela.
- **Por quê (responsabilidade):** vários motivos de mudança no mesmo componente; difícil de testar isoladamente.
- **Correção:** extrair a linha da tabela para um componente `AdminProductRow` e a lógica de carga/ações para um hook `useAdminProducts`.

### R-05
- **Arquivo:** `client/src/pages/AdminProducts.jsx`, `client/src/api.js`, `client/src/components/AdminLayout.jsx`
- **Trecho:** tratamento de 401
- **Problema:** `api.js` limpa o token em 401; `AdminProducts` decide redirecionar comparando `err.message === 'Não autorizado'` (texto do servidor); `AdminLayout` só verifica a existência do token na montagem.
- **Por quê (responsabilidade):** a política de sessão expirada está dividida em três lugares e depende de uma string de mensagem.
- **Correção:** fazer `api.js` lançar um erro com `status` (ex.: classe `ApiError`) e centralizar o redirecionamento de 401 em um único ponto (o layout admin ou um handler comum).

### R-06
- **Arquivo:** `client/src/pages/AdminProductNew.jsx` e `AdminProductEdit.jsx`
- **Trecho:** funções `save`
- **Problema:** nenhum problema relevante de responsabilidade além da duplicação registrada em D-02.

## 3. Repetição / duplicação

### D-01
- **Arquivo:** `server/src/routes/admin.js`
- **Trecho:** handlers `POST /products`, `PUT /products/:id`, e as respostas de não encontrado
- **Problema:** o par `const { value, error } = parseProduct(req.body); if (error) return res.status(400).json({ error });` aparece em POST e PUT (e em `PUT /store` com `parseStore`). A mensagem `'Produto não encontrado'` aparece no `router.param`, em `notFound` e em `public.js`.
- **Por quê (duplicação):** alterar o formato de erro de validação ou a mensagem exige editar vários pontos.
- **Correção:** criar um middleware `validateBody(parser)` que coloque `req.parsed` ou responda 400; usar `notFound(res)` também dentro de `router.param` e extrair a mensagem para constante compartilhada.

### D-02
- **Arquivo:** `client/src/pages/AdminProductNew.jsx` e `AdminProductEdit.jsx`
- **Trecho:** `save` (chamada `api` + `navigate('/admin')`)
- **Problema:** as duas páginas repetem o mesmo padrão salvar-e-voltar, e ambas montam título + `ProductForm`.
- **Por quê (duplicação):** o fluxo pós-salvamento está replicado.
- **Correção:** extrair um componente `ProductEditor({ title, initial, request })` que cuide de `navigate`, ou um hook `useSaveAndReturn(path)`.

### D-03
- **Arquivo:** `client/src/pages/AdminLogin.jsx`, `ProductForm.jsx`, `AdminStore.jsx`
- **Trecho:** manuseio de `submit` com `try/catch` e exibição de erro
- **Problema:** três formulários repetem o ciclo `preventDefault → limpar erro → await → catch → setError`, e o parágrafo de erro `role="alert" className="error"` também se repete (inclui `AdminProducts`).
- **Por quê (duplicação):** inconsistências já existem (ex.: `AdminStore` não limpa a mensagem anterior antes de enviar; `ProductForm` limpa).
- **Correção:** hook `useFormSubmit(action)` que devolva `{ submit, error }` e um componente `<ErrorMessage>`.

### D-04
- **Arquivo:** `client/src/pages/Home.jsx`, `ProductDetail.jsx`
- **Trecho:** mensagens de "Carregando…" e de erro por página
- **Problema:** cada página reimplementa o ramo `loading`/`error` com marcação ligeiramente diferente.
- **Por quê (duplicação):** variações acidentais de marcação (`<p className="page">` vs `<p>`).
- **Correção:** componente `<QueryState query={...}>` para os estados de carregamento e erro.

### D-05
- **Arquivo:** `server/src/routes/admin.js`
- **Trecho:** `findOneAndUpdate(..., { returnDocument: 'after' })` em PUT e PATCH, seguido de `updated ? res.json(toDto(updated)) : notFound(res)`
- **Problema:** padrão repetido três vezes (GET por id, PUT, PATCH).
- **Por quê (duplicação):** pequeno, mas passível de divergir.
- **Correção:** função `respondWithProductOrNotFound(res, product)`.

## 4. Complexidade de fluxo, condicionais e aninhamento

### C-01
- **Arquivo:** `server/src/routes/admin.js`
- **Trecho:** `product ? res.json(...) : notFound(res);` (linhas 51, 68, 75, 80)
- **Problema:** operador ternário usado como instrução, com efeito colateral, em vez de `if`/`return`.
- **Por quê (complexidade):** esconde o fluxo de controle e é inconsistente com o `if (!product) return res.status(404)…` de `public.js`.
- **Correção:** `if (!product) return notFound(res); res.json(toDto(product));` ou usar a função de D-05.

### C-02
- **Arquivo:** `server/src/routes/admin.js`
- **Trecho:** `saveHandling(res, async () => { … res.status(201)… })`
- **Problema:** o callback envia a resposta de sucesso dentro de um wrapper que trata erro; o fluxo é um `catch` encadeado sobre uma função assíncrona que escreve em `res`.
- **Por quê (complexidade):** dois níveis de função aninhada e a responsabilidade de resposta dividida entre wrapper e callback.
- **Correção:** `try { … } catch (err) { if (isDuplicateKey(err)) return res.status(409)…; throw err; }` direto no handler, ou um middleware de erro que mapeie `err.code === 11000` para 409 (aproveitando o tratador de erros de `app.js`).

### C-03
- **Arquivo:** `client/src/components/ProductForm.jsx`
- **Trecho:** `set(field)` com `e.target.type === 'checkbox' ? … : …`
- **Problema:** um único handler ramifica por tipo de input e usa `form` do closure (`setForm({ ...form, … })`).
- **Por quê (complexidade):** o uso de `form` capturado pode sobrescrever estado em atualizações rápidas; a ramificação por tipo de DOM mistura responsabilidades.
- **Correção:** usar atualização funcional `setForm((f) => ({ ...f, [field]: value }))`; o mesmo vale para `AdminStore.jsx` (`setForm({ ...form, … })`).

### C-04
- **Arquivo:** `client/src/pages/AdminProducts.jsx`
- **Trecho:** `remove`
- **Problema:** o `window.confirm` está dentro da função passada a `run`; se o usuário cancela, `run` ainda executa `load()` e recarrega a lista sem necessidade.
- **Por quê (complexidade):** a decisão de cancelar é implícita (nenhum retorno) e provoca requisição desnecessária.
- **Correção:** `if (!window.confirm(...)) return;` antes de acionar `run`, ou fazer a ação retornar um sinal de cancelamento.

### C-05
- **Arquivo:** `client/src/pages/ProductDetail.jsx`
- **Trecho:** `store.data?.whatsapp` e ausência do ramo `store.error`
- **Problema:** o fluxo trata `product.error`, mas não `store.error`; o `?.` mascara o caso em que `store.data` é nulo por falha e gera um link `https://wa.me/undefined?...`.
- **Por quê (complexidade/erros):** condicional defensiva em vez de ramo de erro explícito.
- **Correção:** tratar `store.error` explicitamente (ver E-04) e remover o `?.`.

### C-06
- **Arquivo:** `server/src/validation.js`
- **Trecho:** `parseProduct` (objeto `labels` dentro da função)
- **Problema:** nenhum problema relevante de aninhamento; a única observação é que `labels` é recriado a cada chamada e poderia ser constante de módulo (`REQUIRED_PRODUCT_LABELS`), o que também o documenta.

## 5. Tratamento de erros e falhas previsíveis

### E-01
- **Arquivo:** `server/src/app.js`
- **Trecho:** middleware de erro final
- **Problema:** qualquer erro vira 500 `'Erro interno'`, incluindo corpo JSON malformado (que `express.json()` rejeita com `err.status` 400) e payload grande demais (413).
- **Por quê (erros):** erros do cliente são reportados como falha do servidor e poluem o log com `console.error`.
- **Correção:** respeitar `err.status`/`err.statusCode` quando 4xx e responder com mensagem apropriada (ex.: `'JSON inválido'`); reservar 500 para o restante.

### E-02
- **Arquivo:** `server/src/routes/admin.js`
- **Trecho:** `router.post('/login')`
- **Problema:** `String(email)` e `String(password)` convertem `undefined` em `"undefined"` e objetos em `"[object Object]"`; não há validação de tipo antes da consulta.
- **Por quê (erros):** entradas inválidas seguem como se fossem credenciais válidas, passando pela consulta ao banco e pelo `scrypt`.
- **Correção:** validar `typeof email === 'string' && typeof password === 'string'` e responder 400 (ou o mesmo 401 genérico) antes de consultar o banco.

### E-03
- **Arquivo:** `server/src/auth.js`
- **Trecho:** `verifyPassword`
- **Problema:** `scryptSync(password, salt, expected.length)` com `hash` não hexadecimal gera buffer vazio (`expected.length === 0`), o que lança exceção em `scryptSync`; `String(stored).split(':')` aceita formatos com mais de duas partes sem sinalizar.
- **Por quê (erros):** um registro corrompido produz exceção (500) no lugar de falha de autenticação.
- **Correção:** validar `expected.length > 0` e envolver em `try/catch` retornando `false`. Observação adicional: `scryptSync` bloqueia o event loop em cada login; preferir `crypto.scrypt` assíncrono (sem mudar o comportamento).

### E-04
- **Arquivo:** `client/src/pages/Home.jsx`, `ProductDetail.jsx`
- **Trecho:** estados de erro
- **Problema:** em `ProductDetail`, qualquer erro de `product` (rede, 500) exibe "Produto não encontrado", e a falha de `store` é ignorada. Em `Home`, o erro específico é descartado (mensagem única).
- **Por quê (erros):** o usuário não distingue 404 de falha de rede; informação útil é perdida.
- **Correção:** com `ApiError.status` (R-05), exibir "não encontrado" apenas para 404 e mensagem de falha genérica nos demais casos; tratar `store.error`.

### E-05
- **Arquivo:** `client/src/api.js`
- **Trecho:** `api()`
- **Problema:** `await res.json()` falha com `SyntaxError` se a resposta não for JSON (ex.: erro de proxy, 502 em HTML), e a exceção de `fetch` de rede (`TypeError: Failed to fetch`) chega à interface como mensagem técnica. O erro lançado é um `Error` genérico, sem `status`.
- **Por quê (erros):** mensagens incompreensíveis para o usuário e impossibilidade de reagir por tipo de falha.
- **Correção:** ler o corpo com `res.json().catch(() => ({}))`, capturar falha de rede e lançar `ApiError(message, status)` com mensagem amigável.

### E-06
- **Arquivo:** `client/src/pages/AdminStore.jsx`
- **Trecho:** `useEffect(() => { api('/store').then(setForm); }, []);`
- **Problema:** não há `.catch`; se a busca falhar, ocorre rejeição não tratada e a tela fica em "Carregando…" para sempre. A mensagem de sucesso/erro também não é limpa ao reeditar.
- **Por quê (erros):** falha previsível (rede/401) sem feedback e sem saída.
- **Correção:** adicionar `.catch((err) => setMessage({ text: err.message, error: true }))` e exibir o erro quando `form` for nulo; usar `useFetch` para unificar com D-04.

### E-07
- **Arquivo:** `client/src/pages/AdminProducts.jsx`
- **Trecho:** `if (!products) return <p>{error || 'Carregando…'}</p>;`
- **Problema:** estado de erro e de carregamento compartilham o mesmo ramo, e a detecção de sessão expirada compara texto (ver R-05).
- **Por quê (erros):** frágil diante de mudança de mensagem/idioma do servidor.
- **Correção:** usar `err.status === 401`.

### E-08
- **Arquivo:** `server/src/routes/admin.js`
- **Trecho:** `router.param('id', …)` e `toObjectId`
- **Problema:** `ObjectId.isValid(id) && String(id).length === 24` combina duas verificações para contornar o comportamento de `isValid` com strings de 12 caracteres; a razão não está documentada. Um id inválido retorna 404 com mensagem de produto, o que é adequado, mas a condição é opaca.
- **Por quê (clareza/erros):** a checagem dupla parece redundante a quem lê e pode ser removida por engano.
- **Correção:** comentário explicando a razão ou regex `/^[0-9a-f]{24}$/i`.

### E-09
- **Arquivo:** `server/src/index.js` e `server/src/db.js`
- **Trecho:** conexão inicial e `listen`
- **Problema:** se o MongoDB estiver indisponível, `await connect(...)` rejeita no topo do módulo sem mensagem contextual, e não há encerramento gracioso do cliente.
- **Por quê (erros):** a falha de inicialização mais previsível (banco fora do ar) resulta em stack trace cru.
- **Correção:** `try/catch` em torno da conexão com mensagem clara e `process.exit(1)`; tratar `SIGINT/SIGTERM` fechando `client`.

### E-10
- **Arquivo:** `server/src/config.js`
- **Trecho:** `tokenSecret: process.env.TOKEN_SECRET || 'dev-secret-change-me'`
- **Problema:** o segredo de assinatura tem fallback silencioso, inclusive em produção.
- **Por quê (erros):** configuração ausente passa despercebida em vez de falhar explicitamente.
- **Correção:** manter o default apenas quando `NODE_ENV !== 'production'`; caso contrário lançar erro na inicialização (o comportamento em desenvolvimento permanece igual).

### E-11
- **Arquivo:** `server/src/validation.js`
- **Trecho:** `parseProduct` / `parseStore`
- **Problema:** nenhum problema relevante de tratamento de erros além do que já foi registrado; os retornos `{ value, error }` são consistentes e a validação trata entradas não string.

---

## Resumo por critério

| Critério | Apontamentos |
|---|---|
| Clareza e precisão de nomes | N-01 a N-05 (N-06: nenhum adicional) |
| Separação de responsabilidades | R-01 a R-05 (R-06: nenhum adicional) |
| Repetição/duplicação | D-01 a D-05 |
| Complexidade de fluxo | C-01 a C-05 (C-06: observação menor) |
| Tratamento de erros | E-01 a E-10 (E-11: nenhum adicional) |

Os arquivos `server/src/slug.js`, `server/src/routes/products-dto.js` (além de N-01), `client/src/whatsapp.js`, `client/src/App.jsx`, `client/src/main.jsx`, `client/src/components/ProductCard.jsx` e `client/src/useFetch.js`: nenhum problema relevante identificado.
