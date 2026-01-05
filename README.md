# BACKEND + FRONTEND

- [BACKEND + FRONTEND](#backend--frontend)
  - [1. Formas de Conexão Backend-Frontend](#1-formas-de-conexão-backend-frontend)
    - [1.1 APIs RESTful (Mais comum)](#11-apis-restful-mais-comum)
    - [1.2 GraphQL (Alternativa moderna)](#12-graphql-alternativa-moderna)
    - [1.3 WebSockets (Conexão em tempo real)](#13-websockets-conexão-em-tempo-real)
    - [1.4 🚀 Passos Práticos para Integrar](#14--passos-práticos-para-integrar)
    - [1.5 Configuração Básica](#15-configuração-básica)
  - [2. ⚠️ Cuidados Importantes](#2-️-cuidados-importantes)
    - [2.1 CORS (Cross-Origin Resource Sharing)](#21-cors-cross-origin-resource-sharing)
    - [2.2 Variáveis de Ambiente](#22-variáveis-de-ambiente)
    - [2.3 Proxy no Desenvolvimento (Create React App)](#23-proxy-no-desenvolvimento-create-react-app)
  - [3. 🌐 Deploy/Hospedagem](#3--deployhospedagem)
    - [3.1 Opção 1: Separados](#31-opção-1-separados)
    - [3.2 Opção 2: Juntos](#32-opção-2-juntos)
    - [3.3 🛠️ Ferramentas Úteis](#33-️-ferramentas-úteis)
  - [4. 📦 Exemplo Completo Simplificado](#4--exemplo-completo-simplificado)

## 1. Formas de Conexão Backend-Frontend

Há maneiras diferentes de integrar ambos, a depender do tipo da API (REST, GraphQL, Websocket, etc).

### 1.1 APIs RESTful (Mais comum)

```js
// Frontend (React exemplo) fazendo requisição
fetch('https://api.seusite.com/users', {
  method: 'GET',
  headers: {'Content-Type': 'application/json'}
})
.then(response => response.json())
.then(data => console.log(data));
```

### 1.2 GraphQL (Alternativa moderna)

- Single endpoint para todas as queries.
- Frontend solicita exatamente os dados que precisa.

### 1.3 WebSockets (Conexão em tempo real)

- Para chats, notificações, dashboards ao vivo.
- Conexão bidirecional persistente.

### 1.4 🚀 Passos Práticos para Integrar

Ambiente de Desenvolvimento:

```bash
# Estrutura comum de projeto
projeto/
├── backend/    # Node.js, Python, Java, etc.
├── frontend/   # React, Vue, Angular, etc.
└── README.md
```

### 1.5 Configuração Básica

Backend expõe endpoints:

```js
// Exemplo Node.js/Express
const express = require('express'); // commonJS
const app = express();
app.use(express.json());
app.get('/api/produtos', (req, res) => {
  res.json([{id: 1, nome: "Produto A"}]);
});
app.listen(3001);
```

## 2. ⚠️ Cuidados Importantes

### 2.1 CORS (Cross-Origin Resource Sharing)

```js
// No backend (Express.js)
const cors = require('cors');
app.use(cors()); // Permite requisições do frontend
```

### 2.2 Variáveis de Ambiente

```js
// .env no frontend
REACT_APP_API_URL="http://localhost:3001"

// .env no backend
PORT=3001
DB_URL="sua_conexao_mongodb"
```

### 2.3 Proxy no Desenvolvimento (Create React App)

```js
// package.json do frontend
{
  "proxy": "http://localhost:3001"
}
```

## 3. 🌐 Deploy/Hospedagem

### 3.1 Opção 1: Separados

- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** Heroku, AWS, DigitalOcean, Railway

### 3.2 Opção 2: Juntos

- **Full-stack:** Vercel (com serverless), AWS Amplify
- **Container:** Docker + Kubernetes

### 3.3 🛠️ Ferramentas Úteis

- **Testar APIs:** Postman, Insomnia
- **Documentação:** Swagger/OpenAPI
- **Autenticação:** JWT, OAuth 2.0
- **Estado Global:** Redux, Context API + React Query

## 4. 📦 Exemplo Completo Simplificado

**BACKEND (Node.js + Express):**

1. npm init, instalar express, cors
2. Criar rotas GET, POST, PUT, DELETE
3. Configurar CORS e middlewares

**FRONTEND (React):**

1. npx create-react-app frontend
2. Configurar proxy ou variável de ambiente
3. Fazer chamadas com fetch ou axios
4. Tratar estados de loading, error, success

**Dica:** APIs REST são mais simples para aprendizagem. Use axios no frontend (melhor que fetch para tratamento de erros).
