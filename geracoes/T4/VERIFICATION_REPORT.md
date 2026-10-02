# Relatório de Verificação de Boas Práticas

Escopo: código de implementação em `server/src` e `client/src`. Testes e configuração foram lidos apenas como contexto. Nenhum arquivo foi alterado. Não há nota, ranking ou pontuação neste relatório.

Critérios: **N** = clareza de nomes · **R** = separação de responsabilidades · **D** = duplicação · **C** = complexidade de fluxo · **E** = tratamento de erros.

---

## 1. Clareza e precisão de nomes

### N1
- **Arquivo:** `client/src/pages/AdminProductEdit.jsx`, `client/src/pages/Home.jsx`, `client/src/pages/ProductDetail.jsx`
- **Trecho:** `const product = useFetch(...)`, `const store = useFetch(...)`, `const products = useFetch(...)`
- **Problema:** a variável recebe o *estado da requisição* (`{ data, error, loading }`), mas tem nome de entidade. Resulta em leituras como `product.data`, `products.data.map`, `store.data.storeName`, e `ProductDetail` ainda cria `const p = product.data`.
- **Impacto:** o leitor espera que `product` seja o produto; é preciso abrir `useFetch` para entender o formato.
- **Correção:** desestruturar com nomes explícitos, p.ex. `const { data: product, loading, error } = useFetch(...)`, ou nomear `productRequest` / `storeRequest`.

### N2
- **Arquivo:** `server/src/routes/admin.js`
- **Trecho:** `saveHandling` (linhas 39–43)
- **Problema:** o nome não diz o que a função faz (converter erro de chave duplicada em HTTP 409).
- **Impacto:** quem lê `await saveHandling(res, async () => ...)` não sabe que existe tratamento de slug duplicado ali.
- **Correção:** renomear para `withDuplicateSlugHandling` ou `respondConflictOnDuplicateSlug`.

### N3
- **Arquivo:** `client/src/pages/AdminProducts.jsx`
- **Trecho:** `run` (linha 19), `p` (linhas 28, 29, 44)
- **Problema:** `run` é genérico (na verdade executa uma ação, recarrega a lista e captura erro); `p` é abreviação de produto em um componente que já tem `products`.
- **Impacto:** reduz a legibilidade dos handlers `toggle`/`remove` e do `map` de linhas da tabela.
- **Correção:** `runAndReload` (ou `mutateAndReload`) e `product`.

### N4
- **Arquivo:** `client/src/components/ProductForm.jsx`
- **Trecho:** `const set = (field) => (e) => ...` (linha 9)
- **Problema:** `set` é muito genérico e colide semanticamente com `Set`/`setForm`; não indica que retorna um handler de `onChange`.
- **Correção:** `handleChange(field)` ou `bindField(field)`.

### N5
- **Arquivo:** `server/src/validation.js`
- **Trecho:** helper `text` (linha 3)
- **Problema:** o nome sugere um valor, não uma função de normalização (string aparada ou `''`).
- **Correção:** `trimmedString` ou `toTrimmedText`.

---

## 2. Separação de responsabilidades

### R1
- **Arquivo:** `server/src/seed.js` (definição), `server/src/routes/admin.js` e `server/src/routes/public.js` (uso)
- **Trecho:** `export const STORE_ID = 'store'`
- **Problema:** as rotas de runtime importam uma constante de domínio do script de *seed*. Ao importar `seed.js`, as rotas também carregam `connect`, `hashPassword` e `ADMIN_SEED`.
- **Impacto:** acopla código de produção a um script de fixture; mudar/remover o seed afeta as rotas.
- **Correção:** mover `STORE_ID` para um módulo de domínio (p.ex. `server/src/store.js` ou `config.js`) e fazer `seed.js` e as rotas importarem de lá.

### R2
- **Arquivo:** `server/src/config.js`
- **Trecho:** `export const ADMIN_SEED = { email: ..., password: ... }`
- **Problema:** credenciais de fixture convivem com a configuração de runtime (`port`, `mongoUri`, `tokenSecret`).
- **Impacto:** mistura dado de carga inicial com configuração do servidor.
- **Correção:** mover `ADMIN_SEED` para `seed.js` (único consumidor de implementação) ou para um módulo `fixtures.js`.

### R3
- **Arquivo:** `server/src/routes/products-dto.js`
- **Trecho:** `toDto`
- **Problema:** um mapeador de dados está dentro de `routes/`, e o nome `toDto` é genérico, embora o arquivo se chame `products-dto`. Também é aplicado a nada além de produtos, mas a remoção de `_id` em `public.js` (linha 10, settings) é feita à parte, de forma ad hoc.
- **Correção:** mover para `server/src/dto.js` (ou `mappers.js`), renomear para `toProductDto`, e criar um `toStoreDto` simétrico para a loja.

### R4
- **Arquivo:** `client/src/pages/AdminProducts.jsx`
- **Trecho:** `load` (linhas 10–16)
- **Problema:** o componente de listagem decide a política de sessão (redireciona para login quando a mensagem é `'Não autorizado'`). Essa regra não existe nas outras páginas administrativas (`AdminProductEdit`, `AdminStore`, `AdminProductNew`).
- **Impacto:** a política de autenticação fica espalhada e inconsistente; ver também E4.
- **Correção:** centralizar o tratamento de 401 em `api.js` (p.ex. lançar um erro tipado `UnauthorizedError`) e o redirecionamento em `AdminLayout`.

---

## 3. Repetição / duplicação desnecessária

### D1
- **Arquivo:** `server/src/routes/admin.js` (linhas 32 e 37), `server/src/routes/public.js` (linha 21)
- **Trecho:** `res.status(404).json({ error: 'Produto não encontrado' })`
- **Problema:** a mesma resposta aparece três vezes; em `admin.js`, o `router.param` (linha 32) repete o literal porque o helper `notFound` só é declarado depois (linha 37).
- **Correção:** declarar `notFound` antes de `router.param` e usá-lo também ali; exportar o helper para uso em `public.js`.

### D2
- **Arquivo:** `server/src/routes/admin.js`
- **Trecho:** `PUT /products/:id` (linhas 67–68) e `PATCH /products/:id/active` (linhas 74–75)
- **Problema:** ambos repetem `findOneAndUpdate(req.filter, { $set: ... }, { returnDocument: 'after' })` seguido de `updated ? res.json(toDto(updated)) : notFound(res)`.
- **Correção:** extrair `updateProduct(res, filter, changes)` que executa a atualização e responde 200/404.

### D3
- **Arquivo:** `client/src/components/ProductForm.jsx` (linhas 12–20, 45), `client/src/pages/AdminLogin.jsx` (linhas 11–21, 32), `client/src/pages/AdminStore.jsx` (linhas 17–25, 36)
- **Trecho:** handlers `submit` e exibição de erro
- **Problema:** três formulários repetem o mesmo fluxo `preventDefault → limpar erro → try/await → catch setError(err.message)` e o mesmo JSX `{error && <p role="alert" className="error">…</p>}` (também em `AdminProducts.jsx`, linha 38).
- **Correção:** extrair um hook `useSubmit(action)` que retorna `{ submit, error }` e um componente `<ErrorMessage message={error} />`.

### D4
- **Arquivo:** `client/src/pages/AdminProducts.jsx` (linhas 6–17, 33), `client/src/pages/AdminStore.jsx` (linhas 12, 15, 27)
- **Trecho:** carregamento manual com `useState` + `useEffect` + `api(...)`
- **Problema:** reimplementam o que `useFetch` já faz (estado de carregamento/erro), mas com regras diferentes (AdminStore sem erro; AdminProducts com lógica própria).
- **Correção:** adicionar a `useFetch` uma função `reload` (e, para AdminStore, usar `data` como valor inicial do formulário) e reutilizá-lo nesses componentes.

### D5
- **Arquivo:** `server/src/routes/admin.js` (linha 46), `server/src/routes/public.js` (linha 15)
- **Trecho:** `products.find(...).sort({ name: 1 }).toArray()`
- **Problema:** a ordenação padrão da listagem está duplicada; uma mudança precisa ser feita em dois lugares.
- **Correção:** extrair `listProducts(collection, filter)` ou uma constante `PRODUCT_SORT = { name: 1 }`.

### D6
- **Arquivo:** vários (`Home.jsx` linha 8, `ProductDetail.jsx` linha 10, `AdminProductEdit.jsx` linha 16, `AdminStore.jsx` linha 27, `AdminProducts.jsx` linha 33)
- **Trecho:** `<p ...>Carregando…</p>`
- **Problema:** indicador de carregamento repetido, com variações de `className`.
- **Correção:** componente `<Loading />`.

---

## 4. Complexidade de fluxo e condicionais/aninhamentos

### C1
- **Arquivo:** `server/src/routes/admin.js`
- **Trecho:** `saveHandling` + uso em POST/PUT (linhas 39–43, 57–60, 66–69)
- **Problema:** a resposta HTTP de sucesso é emitida *dentro* de um callback passado a um wrapper que só trata o erro; o fluxo fica invertido (o handler delega o envio da resposta a uma closure, e o wrapper re-lança outros erros).
- **Impacto:** é difícil ver em que ponto a resposta é enviada e qual erro vira 409.
- **Correção:** fluxo linear com `try/catch` explícito, ou um helper que apenas traduz o erro: `try { ... } catch (err) { if (isDuplicateKey(err)) return conflict(res); throw err; }`.

### C2
- **Arquivo:** `server/src/routes/admin.js` (linhas 51, 68, 75, 80)
- **Trecho:** `product ? res.json(...) : notFound(res);`
- **Problema:** ternário usado como instrução com efeito colateral, enquanto `public.js` (linha 21) usa `if (!product) return ...`. Estilos diferentes para o mesmo fluxo.
- **Correção:** padronizar com guarda: `if (!updated) return notFound(res); res.json(toDto(updated));`.

### C3
- **Arquivo:** `client/src/pages/AdminProducts.jsx`
- **Trecho:** `remove` (linhas 29–31)
- **Problema:** a confirmação do usuário está dentro da ação passada a `run`; quando o usuário cancela, `run` ainda executa `load()` e faz uma requisição desnecessária.
- **Impacto:** o fluxo condicional fica escondido dentro do callback e produz efeito extra.
- **Correção:** verificar `window.confirm` antes de chamar `run`: `const remove = (product) => () => { if (!window.confirm(...)) return; return run(() => api(...))(); }`.

### C4
- **Arquivo:** `client/src/pages/AdminStore.jsx` (linha 36) e `client/src/pages/ProductDetail.jsx` (linha 11)
- **Trecho:** JSX em linha única com ternários repetidos (`message.error ? 'alert' : 'status'`, `message.error ? 'error' : 'ok'`) e bloco de erro inteiro em uma linha.
- **Problema:** condições repetidas e linhas longas dificultam leitura.
- **Correção:** derivar `const isError = message.error` / objeto de estilo uma vez, e quebrar o JSX de `ProductDetail` em várias linhas (ou reutilizar o componente sugerido em D3).

---

## 5. Tratamento de erros e falhas previsíveis

### E1
- **Arquivo:** `server/src/app.js`
- **Trecho:** middleware de erro (linhas 13–16)
- **Problema:** todo erro vira 500 `'Erro interno'`. Um corpo JSON malformado (erro do `express.json()`, com `err.status = 400` e `err.type = 'entity.parse.failed'`) é respondido como erro interno.
- **Impacto:** falha previsível do cliente é reportada como falha do servidor e poluí o log.
- **Correção:** respeitar `err.status`/`err.statusCode` quando < 500 (p.ex. 400 com `'JSON inválido'`) e só cair em 500 nos demais casos.

### E2
- **Arquivo:** `client/src/api.js`
- **Trecho:** `await res.json()` (linha 18)
- **Problema:** se a resposta não for JSON (proxy do Vite retornando 502/504 em HTML quando a API está fora, ou corpo vazio), `res.json()` lança `SyntaxError` e a UI exibe uma mensagem técnica ("Unexpected token <…"). Falhas de rede do `fetch` (`TypeError: Failed to fetch`) também chegam cruas à interface.
- **Correção:** envolver o parse em `try/catch` (ou checar `content-type`) e lançar `new Error('Erro na requisição')`/`'Falha de conexão com o servidor'` quando o corpo não for JSON ou o `fetch` falhar.

### E3
- **Arquivo:** `client/src/pages/AdminStore.jsx`
- **Trecho:** `useEffect(() => { api('/store').then(setForm); }, [])` (linha 15)
- **Problema:** não há `catch`; se a requisição falhar, a página fica eternamente em "Carregando…" e gera *unhandled promise rejection*. Também não há proteção contra `setState` após desmontagem.
- **Correção:** usar `useFetch('/store')` (que já trata erro/cancelamento) ou adicionar `.catch((err) => setMessage({ text: err.message, error: true }))` e renderizar o erro.

### E4
- **Arquivo:** `client/src/pages/AdminProducts.jsx` (linha 13), `client/src/api.js` (linha 20)
- **Trecho:** `if (err.message === 'Não autorizado') navigate('/admin/login')`
- **Problema:** o fluxo de sessão expirada depende da comparação com o texto da mensagem do servidor. Além disso, em `AdminProductEdit`, `AdminProductNew` e `AdminStore`, um 401 apenas limpa o token e mostra a mensagem, sem redirecionar; e em `run` (linha 24) do próprio `AdminProducts` também não há redirecionamento.
- **Impacto:** mudar o texto da mensagem quebra o redirecionamento; comportamento inconsistente entre telas administrativas.
- **Correção:** em `api.js`, anexar `status` ao erro (`err.status = res.status`) ou lançar classe `UnauthorizedError`; tratar o redirecionamento em um único ponto (p.ex. `AdminLayout` ou um hook `useAdminApi`).

### E5
- **Arquivo:** `client/src/pages/ProductDetail.jsx`
- **Trecho:** linhas 10–11 e 26 (`whatsappUrl(store.data?.whatsapp, p.name)`)
- **Problema:** o erro de `store` é ignorado; se `/store` falhar, o link é gerado como `https://wa.me/undefined?...`. Além disso, qualquer erro em `product` (incluindo falha de rede/500) é exibido como "Produto não encontrado".
- **Correção:** tratar `store.error` (exibir mensagem ou desabilitar o botão quando não houver número) e diferenciar 404 de outras falhas usando o status do erro (ver E4).

### E6
- **Arquivo:** `server/src/routes/admin.js`
- **Trecho:** `POST /login` (linhas 19–21)
- **Problema:** `String(email)` e `String(password)` convertem campos ausentes em `'undefined'`, executando consulta ao banco e `scrypt` para uma requisição sabidamente inválida.
- **Correção:** validar que `email` e `password` são strings não vazias antes da consulta e responder 400 (`'E-mail e senha são obrigatórios'`) ou o mesmo 401 sem acessar o banco.

### E7
- **Arquivo:** `server/src/index.js` e `server/src/seed.js` (linhas 42–47)
- **Trecho:** `await connect(...)` em top-level
- **Problema:** falha de conexão com o MongoDB derruba o processo com stack trace bruto, sem mensagem orientando o usuário; em `seed.js`, se `seed()` lançar, `client.close()` não é chamado.
- **Correção:** envolver em `try/catch` com mensagem clara (`'Não foi possível conectar ao MongoDB em <uri>'`) e `process.exit(1)`; em `seed.js`, usar `try/finally` para garantir `client.close()`.

### E8
- **Arquivo:** `client/src/pages/ProductDetail.jsx` (linha 7), `client/src/pages/AdminProductEdit.jsx` (linhas 9, 12), `client/src/pages/AdminProducts.jsx` (linhas 28, 30)
- **Trecho:** interpolação de parâmetros em caminhos (`/products/${slug}`, `/admin/products/${id}`)
- **Problema:** os valores vindos da URL não são codificados; um slug/id com `/`, `?` ou `#` digitado manualmente gera requisição para outra rota em vez de um 404 previsível.
- **Correção:** usar `encodeURIComponent(slug)` / `encodeURIComponent(id)` ao montar os caminhos.
