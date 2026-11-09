# Módulo 5 — Desafio Final

## Objetivo
Integrar o que foi visto: API em camadas, autenticação, banco de dados, testes e contêineres.

## Como este repositório atende
| Requisito | Entrega |
| --- | --- |
| API REST em camadas | Express + controller/service/repository |
| Autenticação | JWT, HTTP Basic, OAuth 2.0 client credentials |
| Dados relacionais | Sequelize (PostgreSQL em produção) |
| Dados NoSQL | MongoDB com Mongoose |
| Consulta flexível | GraphQL em `/graphql` |
| Testes | Jest + supertest, unitários com mocks, cobertura ~94% |
| Qualidade | ESLint e CI (GitHub Actions) em Node 18 e 20 |
| Contêineres | Dockerfile e `docker-compose` (API + PostgreSQL + MongoDB) |
| Documentação | README, OpenAPI e Swagger UI |

## Pendências conhecidas
- OpenID Connect e outros fluxos do OAuth 2.0.
- `docker compose` com PostgreSQL real não foi exercitado.
- SQL puro com `pg` (Módulo 3) não reproduzido; o projeto usa Sequelize.

As avaliações oficiais da plataforma (quizzes) ficam fora do repositório.
