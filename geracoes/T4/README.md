# Catálogo de produtos (MVP)

React + Vite (frontend), Node/Express (API), MongoDB.

## Execução
Requer Node 20+ e MongoDB em `mongodb://127.0.0.1:27017`.

    npm install
    npm run seed      # dados iniciais
    npm run dev       # web: http://localhost:5173 | API: http://localhost:3000/api
    npm run reset-db  # restaura o estado inicial
    npm test          # testes do servidor (banco tcc_catalog_test) e do cliente

Admin: `/admin/login` — `admin@teste.local` / `admin123`.
