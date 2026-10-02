# Catálogo de Produtos — MVP

Aplicação web de catálogo de produtos para pequenas lojas. Visitantes navegam
pelos produtos e entram em contato pelo WhatsApp; o lojista gerencia produtos e
os textos da vitrine em uma área administrativa simples.

## Stack

- **Frontend:** React + Vite (React Router, `fetch` nativo)
- **Backend:** Node.js + Express
- **Banco de dados:** MongoDB (via Mongoose)
- **Autenticação:** JWT (administrador único definido por variáveis de ambiente)

## Estrutura do projeto

```
.
├── backend/                 # API REST (Node + Express + Mongoose)
│   ├── src/
│   │   ├── config/          # configuração de ambiente e conexão com o banco
│   │   ├── controllers/     # regras de cada endpoint
│   │   ├── middleware/      # autenticação e tratamento de erros
│   │   ├── models/          # modelos Mongoose (Product, Settings)
│   │   ├── routes/          # definição das rotas (públicas, admin, auth)
│   │   ├── utils/           # utilitários (slug, async handler, ApiError)
│   │   ├── app.js           # criação/configuração do app Express
│   │   ├── server.js        # ponto de entrada (conecta ao banco e sobe o HTTP)
│   │   └── seed.js          # popula dados de exemplo
│   └── .env.example
│
└── frontend/                # SPA em React
    ├── src/
    │   ├── api/             # cliente HTTP e chamadas à API
    │   ├── components/      # componentes reutilizáveis e layouts
    │   ├── context/         # contexto de autenticação
    │   ├── pages/           # páginas públicas e administrativas
    │   ├── utils/           # utilitários (link de WhatsApp)
    │   ├── App.jsx          # rotas da aplicação
    │   └── styles.css       # estilos globais
    └── .env.example
```

## Pré-requisitos

- **Node.js 18+** e **npm**
- **MongoDB** em execução localmente (ou uma URI de MongoDB Atlas)

Para subir o MongoDB rapidamente com Docker:

```bash
docker run -d --name catalogo-mongo -p 27017:27017 mongo:7
```

## Como executar localmente

A aplicação tem duas partes. Use **dois terminais** (um para o backend, outro
para o frontend).

### 1. Backend

```bash
cd backend
cp .env.example .env        # ajuste as variáveis se necessário
npm install
npm run seed                # cria dados de exemplo (produtos + configurações)
npm run dev                 # inicia a API em http://localhost:4000
```

Variáveis de ambiente principais (`backend/.env`):

| Variável         | Padrão                                  | Descrição                              |
| ---------------- | --------------------------------------- | -------------------------------------- |
| `PORT`           | `4000`                                  | Porta da API                           |
| `MONGODB_URI`    | `mongodb://127.0.0.1:27017/catalogo`    | Conexão com o MongoDB                  |
| `CLIENT_ORIGIN`  | `http://localhost:5173`                 | Origem do frontend (CORS)              |
| `ADMIN_USERNAME` | `admin`                                 | Usuário do administrador               |
| `ADMIN_PASSWORD` | `admin123`                              | Senha do administrador                 |
| `JWT_SECRET`     | (troque por um valor aleatório)         | Segredo para assinar os tokens         |
| `JWT_EXPIRES_IN` | `1d`                                    | Validade do token de login             |

### 2. Frontend

```bash
cd frontend
cp .env.example .env        # opcional: ajuste VITE_API_URL se mudou a porta da API
npm install
npm run dev                 # inicia a aplicação em http://localhost:5173
```

### 3. Acessar

- **Vitrine pública:** http://localhost:5173
- **Área administrativa:** http://localhost:5173/admin
  (login padrão: `admin` / `admin123`)

## Funcionalidades

### Área pública
- Página inicial com nome da loja, título principal e subtítulo
- Listagem dos produtos **ativos**
- Página de detalhes de cada produto
- Botão "Falar no WhatsApp" com mensagem pré-preenchida sobre o produto

### Área administrativa
- Login do administrador
- Listagem de produtos (ativos e inativos)
- Criação e edição de produto
- Ativar/inativar produto
- Excluir produto
- Edição das configurações da vitrine (nome da loja, título, subtítulo e WhatsApp)

## Endpoints da API

Base: `http://localhost:4000/api`

### Públicos
| Método | Rota               | Descrição                          |
| ------ | ------------------ | ---------------------------------- |
| GET    | `/settings`        | Configurações da vitrine           |
| GET    | `/products`        | Lista produtos ativos              |
| GET    | `/products/:slug`  | Detalhes de um produto ativo       |

### Autenticação
| Método | Rota          | Descrição                  |
| ------ | ------------- | -------------------------- |
| POST   | `/auth/login` | Login do administrador     |

### Administrativos (exigem `Authorization: Bearer <token>`)
| Método | Rota                          | Descrição                  |
| ------ | ----------------------------- | -------------------------- |
| GET    | `/admin/products`             | Lista todos os produtos    |
| POST   | `/admin/products`             | Cria um produto            |
| GET    | `/admin/products/:id`         | Detalhes de um produto     |
| PUT    | `/admin/products/:id`         | Atualiza um produto        |
| PATCH  | `/admin/products/:id/toggle`  | Ativa/inativa um produto   |
| DELETE | `/admin/products/:id`         | Exclui um produto          |
| PUT    | `/admin/settings`             | Atualiza as configurações  |

## Modelo de dados

**Product:** `name`, `slug`, `shortDescription`, `fullDescription`, `price` (texto),
`imageUrl`, `active`, além de timestamps.

**Settings (documento único):** `storeName`, `mainTitle`, `subtitle`, `whatsappNumber`.

## Decisões de projeto

- **Administrador único via ambiente:** o escopo pede um único perfil de admin,
  então as credenciais ficam em variáveis de ambiente e não há cadastro de
  usuários. O login emite um JWT usado nas rotas protegidas.
- **Preço como texto:** conforme o requisito, permitindo valores como
  `R$ 99,90` ou `Sob consulta`.
- **Slug automático:** se o identificador não for informado, é gerado a partir
  do nome do produto.
- **Sem bibliotecas desnecessárias:** as requisições usam `fetch` nativo e os
  estilos são CSS puro, mantendo o projeto enxuto e fácil de manter.

## Escopo (intencionalmente fora do MVP)

Não há cadastro/login de clientes, carrinho, checkout, pagamento, pedidos nem
múltiplos perfis de administrador.
