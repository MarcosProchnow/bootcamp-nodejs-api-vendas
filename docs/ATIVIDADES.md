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
| 1 | GraphQL | pendente | — |
| 2 | HTTP Basic (Base64) | feito | `authService.whoamiBasic`, `tests/basicAuth.test.js` |
| 2 | JWT (Bearer) | feito | `authService.login`, `middlewares/authenticate.js`, `tests/auth.test.js` |
| 2 | HTTPS/TLS | conceitual (terminar TLS no proxy) | — |
| 2 | OAuth 2.0 / OpenID | pendente | — |
| 3 | Modelagem Client/Supplier/Product/Sale | feito | `src/services/domain.js` |
| 3 | Estoque na venda e na exclusão | feito | `createSalesService`, `tests/sales.test.js` |
| 3 | Consulta por query string | feito | `memoryRepository.list`, `tests/crud.test.js` |
| 3 | PostgreSQL (pg), Sequelize, MongoDB/Mongoose | pendente | trocar `memoryRepository` |
| 4 | Testes unitários/integração (Jest, supertest) | feito | `tests/` |
| 4 | Cobertura | feito | `npm run test:coverage` |
| 4 | Git / GitHub Flow | CI em `.github/workflows/ci.yml` | — |
| 4 | Contêineres | feito | `Dockerfile`, `docker-compose.yml` |
| 5 | Desafio Final | integra os itens acima | este projeto |

> Testes executados no GitHub Codespaces (Node 24): 4 suites, 20 testes, todos passando.
