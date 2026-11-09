# API de Vendas — Node.js

Projeto desenvolvido no **Bootcamp Desenvolvedor(a) Node.js** (IGTI/XPE), parte da **Pós-Graduação em Desenvolvimento Full Stack e Full Cycle**.

| Bootcamps da pós-graduação |
| --- |
| Bootcamp Arquiteto(a) de Software |
| Bootcamp Desenvolvedor(a) React |
| **Bootcamp Desenvolvedor(a) Node.js** ← este repositório |

API REST de vendas com clientes, fornecedores, produtos e vendas, organizada em camadas (rotas/controller → service → repository), autenticação JWT e HTTP Basic, validação, tratamento de erros, logs, documentação OpenAPI, testes automatizados, Docker e CI.

## Stack
Node.js 18+ · Express · JSON Web Token · Jest · supertest · Docker · GitHub Actions

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
JWT_SECRET=$(openssl rand -hex 32) docker compose up --build
```

## Endpoints

| Recurso | Rotas |
| --- | --- |
| Público | `GET /health`, `POST /auth/register`, `POST /auth/login`, `GET /auth/basic`, `GET /docs/openapi.json` |
| Protegido (Bearer JWT) | `/clients`, `/suppliers`, `/products` (GET, POST, PUT, DELETE), `/sales` (GET, POST, DELETE) |

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

## Limitações e próximos passos
- Persistência em memória: os repositories seguem a mesma interface de um repository com `pg`/Sequelize (Módulo 3), então a troca não altera services nem rotas. Próximo passo: PostgreSQL + Sequelize e MongoDB/Mongoose para avaliações de produto.
- GraphQL (Módulo 1) e OAuth 2.0 (Módulo 2) ainda não implementados.
- Hashing de senha com `scrypt` (módulo `crypto`); em produção, use HTTPS.

## Licença
MIT
