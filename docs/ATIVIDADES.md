# Mapa do bootcamp → projeto

Cada item da ementa e o que foi feito neste repositório. As avaliações da plataforma (quizzes de múltipla escolha) não fazem parte do código; aqui constam as práticas equivalentes. Anotações de estudo por módulo: [estudos/](estudos/README.md).

| Módulo | Tópico da ementa | Status | Onde |
| --- | --- | --- | --- |
| 0 | HTML, CSS e JavaScript no navegador | feito | `public/`, `tests/frontend.test.js` |
| 1 | Express, rotas, middlewares | feito | `src/app.js`, `src/routes/crudRouter.js` |
| 1 | POST, GET, GET por id, PUT, DELETE | feito | `crudRouter.js`, `tests/crud.test.js` |
| 1 | Tratamento de erros | feito | `src/middlewares/errorHandler.js`, `src/errors.js` |
| 1 | Gravação de logs | feito (winston) | `src/logger.js`, `src/middlewares/requestLogger.js` |
| 1 | Validação de campos | feito | `src/validators.js` |
| 1 | CORS | feito | `src/app.js` |
| 1 | Documentação | feito (OpenAPI + Swagger UI em `/api-docs`) | `docs/openapi.json`, `tests/docs.test.js` |
| 1 | Organização Controller/Service/Repository | feito | `src/routes`, `src/services`, `src/repositories` |
| 1 | GraphQL (schema, queries, mutation, relação) | feito | `src/graphql/handler.js`, `tests/graphql.test.js` |
| 2 | HTTP Basic (Base64) | feito | `authService.whoamiBasic`, `tests/basicAuth.test.js` |
| 2 | JWT (Bearer) | feito | `authService.login`, `middlewares/authenticate.js`, `tests/auth.test.js` |
| 2 | HTTPS/TLS | conceitual (terminar TLS no proxy) | — |
| 2 | OAuth 2.0 (client credentials) | feito | `src/services/oauthService.js`, `tests/oauth.test.js`, `tests/unit/oauthService.test.js` |
| 2 | OpenID Connect / outros fluxos | pendente | — |
| 3 | Modelagem Client/Supplier/Product/Sale | feito | `src/services/domain.js` |
| 3 | Estoque na venda e na exclusão | feito | `createSalesService`, `tests/sales.test.js`, `tests/unit/salesService.test.js` |
| 3 | Consulta por query string | feito | `memoryRepository.list`, `tests/crud.test.js` |
| 3 | Sequelize (PostgreSQL em produção, SQLite nos testes), associações | feito | `src/db/models.js`, `src/repositories/sequelizeRepository.js`, `tests/sequelize.test.js` |
| 3 | SQL puro com `pg` (pool, CRUD manual) | pendente (o projeto usa Sequelize) | — |
| 3 | MongoDB/Mongoose (ProductInfo, avaliações) | feito | `src/repositories/productInfoRepository.js`, `src/services/productInfoService.js`, `tests/productInfo.test.js` |
| 4 | Testes de integração (Jest, supertest) | feito | `tests/*.test.js` |
| 4 | Testes unitários, mocks, `test.each`, snapshot inline | feito | `tests/unit/` |
| 4 | Matchers customizados | feito (`toBeJwt`) | `tests/setup.js` |
| 4 | Cobertura | feito | `npm run test:coverage` |
| 4 | ESLint | feito | `eslint.config.js`, `npm run lint` |
| 4 | Git / GitHub Flow | feito (branches, Pull Requests, CI) | [`estudos/gitflow.md`](estudos/gitflow.md), `.github/workflows/ci.yml` |
| 4 | Contêineres | feito (execução do compose com PostgreSQL ainda não exercitada) | `Dockerfile`, `docker-compose.yml` |
| 5 | Desafio Final | integra os itens acima | este projeto |

> CI (GitHub Actions, Node 18 e 20): 14 suites, 75 testes passando (incluindo MongoDB real via service container), cobertura de linhas ~96%.
