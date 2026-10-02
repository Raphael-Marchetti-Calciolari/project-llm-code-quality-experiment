# Catálogo de Produtos — MVP

Aplicação web de catálogo de produtos para pequenas lojas. Visitantes navegam pela
vitrine pública e iniciam contato pelo WhatsApp. Um administrador autenticado
gerencia produtos e as configurações da vitrine.

## Stack

- **Frontend:** React 18 + Vite + React Router
- **Backend:** Node.js + Express + Mongoose
- **Banco de dados:** MongoDB
- **Autenticação administrativa:** JWT + bcryptjs

## Estrutura do projeto

```
.
├── backend/                # API Node.js (Express + MongoDB)
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── index.js        # Inicialização do servidor
│       ├── db.js           # Conexão com o MongoDB
│       ├── auth.js         # Assinatura/validação de JWT
│       ├── seed.js         # Dados iniciais de exemplo
│       ├── models/         # Schemas Mongoose
│       └── routes/         # Endpoints públicos e administrativos
└── frontend/               # Aplicação React + Vite
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js          # Cliente HTTP
        ├── auth.js         # Token administrativo (localStorage)
        ├── styles.css
        ├── components/
        └── pages/
```

## Pré-requisitos

- Node.js 18 ou superior
- MongoDB rodando localmente em `mongodb://localhost:27017` (ou URI configurada)

## Como executar localmente

### 1. Backend

```bash
cd backend
cp .env.example .env        # ajuste as variáveis se quiser
npm install
npm run seed                # cria admin, vitrine e produtos de exemplo
npm run dev                 # inicia em http://localhost:4000
```

### 2. Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env        # já aponta para http://localhost:4000/api
npm install
npm run dev                 # abre em http://localhost:5173
```

## Credenciais de acesso administrativo

Definidas no arquivo `.env` do backend e aplicadas pelo script de seed:

- Usuário: `admin`
- Senha: `admin123`

## Rotas da aplicação

### Área pública

- `/` — Página inicial com nome da loja, título, subtítulo e produtos ativos
- `/produto/:slug` — Página de detalhes do produto e botão de contato no WhatsApp

### Área administrativa

- `/admin/login` — Autenticação
- `/admin/produtos` — Lista, ativação/inativação e exclusão de produtos
- `/admin/produtos/novo` — Criação de produto
- `/admin/produtos/:id/editar` — Edição de produto
- `/admin/vitrine` — Edição das configurações da vitrine

## API

### Endpoints públicos

| Método | Caminho                 | Descrição                       |
| ------ | ----------------------- | ------------------------------- |
| GET    | `/api/health`           | Health check                    |
| GET    | `/api/showcase`         | Retorna as configurações da vitrine |
| GET    | `/api/products`         | Lista produtos ativos           |
| GET    | `/api/products/:slug`   | Detalha um produto ativo        |

### Endpoints administrativos (exigem `Authorization: Bearer <token>`)

| Método | Caminho                                | Descrição                       |
| ------ | -------------------------------------- | ------------------------------- |
| POST   | `/api/auth/login`                      | Login do administrador          |
| GET    | `/api/admin/products`                  | Lista todos os produtos         |
| GET    | `/api/admin/products/:id`              | Detalha um produto              |
| POST   | `/api/admin/products`                  | Cria um produto                 |
| PUT    | `/api/admin/products/:id`              | Atualiza um produto             |
| PATCH  | `/api/admin/products/:id/toggle`       | Alterna status ativo/inativo    |
| DELETE | `/api/admin/products/:id`              | Exclui um produto               |
| GET    | `/api/admin/showcase`                  | Lê as configurações da vitrine  |
| PUT    | `/api/admin/showcase`                  | Atualiza as configurações       |

## Modelos de dados

### Produto

| Campo              | Tipo    | Obrigatório |
| ------------------ | ------- | ----------- |
| `name`             | String  | sim         |
| `slug`             | String  | sim (único) |
| `shortDescription` | String  | sim         |
| `fullDescription`  | String  | sim         |
| `price`            | String  | sim         |
| `imageUrl`         | String  | sim         |
| `active`           | Boolean | default `true` |

### Vitrine (Showcase)

| Campo            | Tipo   | Obrigatório |
| ---------------- | ------ | ----------- |
| `storeName`      | String | sim         |
| `heading`        | String | sim         |
| `subheading`     | String | sim         |
| `whatsappNumber` | String | sim         |

## Dados de exemplo

O script `npm run seed` (executado no backend) cria:

- Um administrador (`admin` / `admin123`)
- Uma vitrine inicial ("Loja Exemplo")
- Quatro produtos de exemplo (três ativos, um inativo)

O seed é idempotente: roda sem efeito quando os dados já existem.

## Decisões de simplicidade

- Sem state management externo no frontend; estado local com `useState`/`useEffect`.
- Cliente HTTP feito com `fetch` nativo.
- Sem biblioteca de componentes; apenas um arquivo de CSS.
- Token JWT armazenado em `localStorage` (suficiente para o MVP).
- Vitrine modelada como um único documento singleton.
- Preço em texto (conforme especificação), permitindo formatos livres.
