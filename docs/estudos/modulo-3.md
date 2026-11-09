# Módulo 3 — Bancos de Dados + Node.js

## Tópicos
Introdução a bancos de dados, SQL (modelagem, tabelas, pool de conexões, CRUD, regras de estoque, query string), SQL com ORM (Sequelize, associações) e NoSQL (MongoDB, Mongoose).

## Conceitos
- **SQL:** modelagem relacional (Client, Supplier, Product, Sale), chaves e relacionamentos, transações para regras que alteram mais de uma tabela.
- **Pool de conexões:** reaproveita conexões; sempre devolver (`release`) em `finally` quando se usa `pg` direto.
- **ORM (Sequelize):** models mapeiam tabelas; associações (`hasMany`, `belongsTo`); evita SQL manual, mas é preciso conhecer o SQL gerado.
- **NoSQL (MongoDB):** documentos flexíveis; bom para dados aninhados como informações e avaliações de produto; `Mongoose` adiciona schema e validação.
- **Regra de negócio:** vender baixa o estoque; excluir a venda devolve; estoque insuficiente → 409.
- **Dinheiro e ponto flutuante:** `0.1 * 3` não é `0.3`; arredonde para centavos (ou use inteiros em centavos).

## Onde aparece no projeto
| Assunto | Arquivo |
| --- | --- |
| Models Sequelize | [`src/db/models.js`](../../src/db/models.js) |
| Repository Sequelize | [`src/repositories/sequelizeRepository.js`](../../src/repositories/sequelizeRepository.js) |
| MongoDB / Mongoose | [`src/repositories/productInfoRepository.js`](../../src/repositories/productInfoRepository.js) |
| Regras de vendas | [`src/services/domain.js`](../../src/services/domain.js) |
| Testes | `tests/sequelize.test.js`, `tests/productInfo.test.js`, `tests/sales.test.js` |

## Limitação honesta
O desenvolvimento em SQL puro com `pg` (pool, `insertClient`, etc.) não foi reproduzido aqui; o projeto usa Sequelize. O PostgreSQL real via `docker compose` ainda não foi exercitado; os testes usam SQLite.

## Aprendizado
Escolher SQL ou NoSQL é escolher o formato do dado: relacional para entidades ligadas e consistentes, documento para informação aninhada que muda de forma.
