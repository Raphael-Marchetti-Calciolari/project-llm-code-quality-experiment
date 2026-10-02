# Catálogo de Produtos — MVP

Aplicação web de catálogo para pequenas lojas, com vitrine pública e painel administrativo.

## Stack

- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Banco de dados:** MongoDB

---

## Pré-requisitos

- Node.js 18+
- MongoDB rodando localmente (porta padrão 27017)

---

## Estrutura do projeto

```
/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── middleware/auth.js
│   │   ├── models/
│   │   │   ├── Product.js
│   │   │   └── Settings.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   └── settings.js
│   │   ├── seed.js
│   │   └── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/AdminLayout.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── ProductDetail.jsx
    │   │   └── admin/
    │   │       ├── Login.jsx
    │   │       ├── ProductForm.jsx
    │   │       ├── Products.jsx
    │   │       └── Settings.jsx
    │   ├── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## Configuração e execução

### 1. Backend

```bash
cd backend
npm install
```

Copie o arquivo de variáveis de ambiente (ou edite o `.env` já existente):

```bash
cp .env.example .env
```

Variáveis disponíveis em `.env`:

| Variável      | Descrição                        | Padrão                              |
|---------------|----------------------------------|-------------------------------------|
| `MONGO_URI`   | URI de conexão com o MongoDB     | `mongodb://localhost:27017/catalogo` |
| `JWT_SECRET`  | Segredo para assinar os tokens   | *(troque em produção)*              |
| `ADMIN_USER`  | Usuário do painel administrativo | `admin`                             |
| `ADMIN_PASS`  | Senha do painel administrativo   | `admin123`                          |
| `PORT`        | Porta do servidor                | `3001`                              |

Popule o banco com dados de exemplo:

```bash
npm run seed
```

Inicie o servidor:

```bash
npm run dev     # desenvolvimento (reinicia ao salvar)
# ou
npm start       # produção
```

O backend estará disponível em **http://localhost:3001**.

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em **http://localhost:5173**.

O Vite já está configurado para fazer proxy das chamadas `/api` para o backend na porta 3001.

---

## Acesso

| URL                           | Descrição                    |
|-------------------------------|------------------------------|
| http://localhost:5173          | Vitrine pública              |
| http://localhost:5173/admin/login | Painel administrativo    |

**Credenciais padrão do admin:** `admin` / `admin123`

---

## API — endpoints principais

### Públicos

| Método | Rota                       | Descrição                  |
|--------|----------------------------|----------------------------|
| GET    | `/api/products`            | Lista produtos ativos       |
| GET    | `/api/products/slug/:slug` | Produto por slug            |
| GET    | `/api/settings`            | Configurações da vitrine    |

### Administrativos (requerem `Authorization: Bearer <token>`)

| Método | Rota                    | Descrição                     |
|--------|-------------------------|-------------------------------|
| POST   | `/api/auth/login`       | Autenticação (retorna token)  |
| GET    | `/api/products/admin`   | Lista todos os produtos        |
| GET    | `/api/products/admin/:id` | Produto por ID              |
| POST   | `/api/products`         | Criar produto                 |
| PUT    | `/api/products/:id`     | Atualizar produto             |
| DELETE | `/api/products/:id`     | Excluir produto               |
| PUT    | `/api/settings`         | Atualizar configurações        |
