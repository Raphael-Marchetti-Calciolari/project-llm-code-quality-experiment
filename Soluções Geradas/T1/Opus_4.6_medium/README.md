# Catálogo de Produtos — MVP

Aplicação web de catálogo de produtos para pequenas lojas, com vitrine pública e painel administrativo.

## Requisitos

- Node.js 18+
- MongoDB rodando localmente na porta padrão (27017)

## Instalação

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Dados iniciais

Com o MongoDB rodando, execute o seed para criar o administrador, as configurações da vitrine e os produtos de exemplo:

```bash
cd backend
npm run seed
```

Credenciais de acesso ao painel administrativo:
- **E-mail:** admin@loja.com
- **Senha:** admin123

## Execução

Abra dois terminais:

```bash
# Terminal 1 — Backend (porta 3001)
cd backend
npm run dev

# Terminal 2 — Frontend (porta 5173)
cd frontend
npm run dev
```

## Acesso

- **Vitrine pública:** http://localhost:5173
- **Painel administrativo:** http://localhost:5173/admin/login

## Estrutura do projeto

```
backend/
  src/
    models/       # Modelos Mongoose (Product, Settings, Admin)
    routes/       # Rotas públicas e administrativas
    middleware/   # Middleware de autenticação JWT
    seed.js       # Script de dados iniciais
    server.js     # Ponto de entrada do servidor
frontend/
  src/
    pages/        # Componentes de página (Home, ProductDetail, Login, Admin*)
    api.js        # Cliente HTTP para comunicação com o backend
    styles.css    # Estilos da aplicação
    App.jsx       # Rotas da aplicação
```
