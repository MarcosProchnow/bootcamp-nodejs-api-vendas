# Mapa do bootcamp → projeto

Cada item da ementa e o que foi feito neste repositório. As avaliações da plataforma (quizzes de múltipla escolha) não fazem parte do código; aqui constam as práticas equivalentes.

| Módulo | Tópico da ementa | Status | Onde |
| --- | --- | --- | --- |
| 1 | Express, rotas, middlewares | feito | `src/app.js`, `src/routes/crudRouter.js` |
| 1 | POST, GET, GET por id, PUT, DELETE | feito | `crudRouter.js`, `tests/crud.test.js` |
| 1 | Tratamento de erros | feito | `src/middlewares/errorHandler.js`, `src/errors.js` |
| 1 | Gravação de logs | feito (console) | `src/middlewares/requestLogger.js` |
| 1 | Validação de campos | feito | `src/validators.js` |
| 1 | CORS | feito | `src/app.js` |
| 1 | Documentação | feito (OpenAPI estático) | `docs/openapi.json` |
| 1 | Organização Controller/Service/Repository | feito | `src/routes`, `src/services`, `src/repositories` |
| 1 | GraphQL (schema, queries, mutation, relação) | feito | `src/graphql/handler.js`, `tests/graphql.test.js` |
| 2 | HTTP Basic (Base64) | feito | `authService.whoamiBasic`, `tests/basicAuth.test.js` |
| 2 | JWT (Bearer) | feito | `authService.login`, `middlewares/authenticate.js`, `tests/auth.test.js` |
| 2 | HTTPS/TLS | conceitual (terminar TLS no proxy) | — |
| 2 | OAuth 2.0 (client credentials) | feito | `src/services/oauthService.js`, `tests/oauth.test.js` |
| 2 | OpenID Connect / outros fluxos | pendente | — |
| 3 | Modelagem Client/Supplier/Product/Sale | feito | `src/services/domain.js` |
| 3 | Estoque na venda e na exclusão | feito | `createSalesService`, `tests/sales.test.js` |
| 3 | Consulta por query string | feito | `memoryRepository.list`, `tests/crud.test.js` |
| 3 | Sequelize (PostgreSQL em produção, SQLite nos testes), associações | feito | `src/db/models.js`, `src/repositories/sequelizeRepository.js`, `tests/sequelize.test.js` |
| 3 | MongoDB/Mongoose (ProductInfo, reviews) | pendente | — |
| 4 | Testes unitários/integração (Jest, supertest) | feito | `tests/` |
| 4 | Cobertura | feito | `npm run test:coverage` |
| 4 | Git / GitHub Flow | CI em `.github/workflows/ci.yml` | — |
| 4 | Contêineres | feito | `Dockerfile`, `docker-compose.yml` |
| 5 | Desafio Final | integra os itens acima | este projeto |

> CI (GitHub Actions, Node 18 e 20): 7 suites, 31 testes passando, cobertura de linhas ~95%.
