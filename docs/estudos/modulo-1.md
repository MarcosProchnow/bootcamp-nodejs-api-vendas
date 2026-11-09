# Módulo 1 — Desenvolvimento Back End com JavaScript

## Tópicos
Back end vs front end, APIs, Node.js, Event Loop, módulos, Express (rotas, middlewares, erros, logs, estáticos), construção de uma API, organização de projetos e GraphQL.

## Conceitos
- **Event Loop:** o Node executa JavaScript em uma thread; I/O é delegado e volta por callbacks/promises. Código síncrono pesado bloqueia todas as requisições.
- **Módulos:** CommonJS (`require`/`module.exports`) e ESM; módulos nativos como `path`, `crypto`, `fs`.
- **Express:** `app.use` encadeia middlewares; middleware de erro tem 4 parâmetros `(err, req, res, next)`; em Express 4 erros assíncronos precisam ser repassados com `next(err)` (por isso o `wrap`).
- **API REST:** verbos e status HTTP (201 criado, 204 sem conteúdo, 400 validação, 401/403 acesso, 404, 409 conflito).
- **Camadas:** Controller/rotas (HTTP) → Service (regra de negócio) → Repository (dados). Cada camada pode ser testada e trocada isoladamente.
- **Validação, CORS, logs (winston), documentação (OpenAPI/Swagger).**
- **GraphQL:** um endpoint, schema tipado, o cliente escolhe os campos; queries leem, mutations alteram.

## Onde aparece no projeto
| Assunto | Arquivo |
| --- | --- |
| Composição e middlewares | [`src/app.js`](../../src/app.js) |
| Rotas/controller | [`src/routes/crudRouter.js`](../../src/routes/crudRouter.js) |
| Services | [`src/services/`](../../src/services) |
| Repository | [`src/repositories/`](../../src/repositories) |
| Erros | [`src/middlewares/errorHandler.js`](../../src/middlewares/errorHandler.js) |
| Logs | [`src/logger.js`](../../src/logger.js) |
| Validação | [`src/validators.js`](../../src/validators.js) |
| OpenAPI / Swagger UI | [`docs/openapi.json`](../openapi.json), rota `/api-docs` |
| GraphQL | [`src/graphql/handler.js`](../../src/graphql/handler.js) |

## Aprendizado
Separar em camadas custou pouco e permitiu trocar memória por Sequelize e Mongoose sem mexer em rotas nem em regras.
