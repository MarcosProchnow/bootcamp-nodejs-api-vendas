# API de Vendas — Node.js

Projeto desenvolvido no **Bootcamp Desenvolvedor(a) Node.js** (IGTI/XPE), parte da **Pós-Graduação em Desenvolvimento Full Stack e Full Cycle**.

| Bootcamps da pós-graduação |
| --- |
| Bootcamp Arquiteto(a) de Software |
| Bootcamp Desenvolvedor(a) React |
| **Bootcamp Desenvolvedor(a) Node.js** ← este repositório |

API REST de vendas com clientes, fornecedores, produtos e vendas, organizada em camadas (rotas/controller → service → repository), autenticação JWT, HTTP Basic e OAuth 2.0 (client credentials), GraphQL, persistência com Sequelize/PostgreSQL, validação, tratamento de erros, logs, documentação OpenAPI, testes automatizados, Docker e CI.

## Stack
Node.js 18+ · Express · GraphQL · Sequelize/PostgreSQL · JSON Web Token · OAuth 2.0 · Jest · supertest · Docker · GitHub Actions

## Como executar

```bash
npm install
cp .env.example .env        # defina JWT_SECRET
npm run dev                 # http://localhost:3000
npm test                    # testes (Jest + supertest)
npm run test:coverage
```

Com Docker:

```bash
JWT_SECRET=$(openssl rand -hex 32) POSTGRES_PASSWORD=$(openssl rand -hex 16) docker compose up --build
```

## Endpoints

| Recurso | Rotas |
| --- | --- |
| Público | `GET /health`, `POST /auth/register`, `POST /auth/login`, `GET /auth/basic`, `POST /oauth/token`, `GET /docs/openapi.json` |
| Protegido (Bearer JWT) | `/clients`, `/suppliers`, `/products` (GET, POST, PUT, DELETE), `/sales` (GET, POST, DELETE), `POST /graphql` |

Regras de negócio: produto exige fornecedor existente; venda valida cliente/produto, **recusa estoque insuficiente (409)**, calcula o total e baixa o estoque; excluir a venda **devolve o estoque**; listagens aceitam filtros por query string (`/products?supplierId=1`).

Exemplo:

```bash
curl -X POST localhost:3000/auth/register -H 'Content-Type: application/json' \
  -d '{"username":"aluno","password":"senha123"}'
TOKEN=$(curl -s -X POST localhost:3000/auth/login -H 'Content-Type: application/json' \
  -d '{"username":"aluno","password":"senha123"}' | sed 's/.*"token":"\([^"]*\)".*/\1/')
curl localhost:3000/clients -H "Authorization: Bearer $TOKEN"
```

## Estrutura

```
src/
  app.js                 composição (factory createApp)
  config.js              variáveis de ambiente
  routes/crudRouter.js   controller/rotas REST
  services/              regras de negócio e autenticação
  repositories/          acesso a dados (em memória)
  middlewares/           authenticate, errorHandler, requestLogger
tests/                   Jest + supertest
docs/openapi.json        documentação da API
```

## Mapa do bootcamp → projeto

Veja [docs/ATIVIDADES.md](docs/ATIVIDADES.md).

## Persistência
- Sem `DATABASE_URL`: dados em memória.
- Com `DATABASE_URL=postgres://...`: Sequelize + PostgreSQL (`docker compose` já sobe o banco). Os testes usam SQLite em memória com a mesma camada de repository.

## OAuth 2.0 e GraphQL
```bash
curl -X POST localhost:3000/oauth/token -d grant_type=client_credentials \
  -d client_id=demo-client -d client_secret=demo-secret   # só em desenvolvimento
```
`POST /graphql` (Bearer): `{ products(supplierId: 1) { name supplier { name } } }`.

## Limitações e próximos passos
- MongoDB/Mongoose (avaliações de produto) e OpenID Connect ainda não foram implementados.
- A integração com PostgreSQL real via `docker compose` não foi exercitada; os testes usam SQLite.
- Hashing de senha com `scrypt`; em produção use HTTPS.

## Licença
MIT
