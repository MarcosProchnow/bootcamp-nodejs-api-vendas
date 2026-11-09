# Módulo 4 — Tópicos Especiais em Desenvolvimento Back End

## Tópicos
Testes unitários (Jest, TDD, mocks, matchers, cobertura, ESLint), testes de integração (supertest, snapshots), Git (GitFlow, GitHub, Trunk Based) e contêineres (Docker, Compose).

## Conceitos
- **Pirâmide de testes:** muitos testes unitários (rápidos), menos de integração, poucos ponta a ponta.
- **TDD:** escrever o teste que falha, fazer passar, refatorar.
- **Mocks (`jest.fn`):** isolam a unidade das dependências e permitem verificar chamadas (`toHaveBeenCalledWith`).
- **Matchers:** `toBe`, `toEqual`, `toMatchObject`, `toBeCloseTo`; é possível criar os seus com `expect.extend` (`toBeJwt`).
- **Snapshots:** guardam a saída esperada; use inline para valores pequenos.
- **Cobertura:** mede linhas executadas, não a qualidade dos testes.
- **supertest:** chama o app Express sem abrir porta.
- **ESLint:** padroniza o código e pega erros antes de rodar.
- **Git:** commits pequenos, branches de feature, Pull Request com CI. **GitFlow** (develop/release/hotfix) vs **Trunk Based** (branch curta e integração contínua em `main`).
- **Docker:** imagem (receita) → contêiner (execução); `Dockerfile` com cache de camadas; `volumes` para dados; `compose` para vários serviços.

## Onde aparece no projeto
| Assunto | Arquivo |
| --- | --- |
| Unitários com mocks | [`tests/unit/`](../../tests/unit) |
| Integração (supertest) | `tests/*.test.js` |
| Matcher customizado | [`tests/setup.js`](../../tests/setup.js) |
| ESLint | [`eslint.config.js`](../../eslint.config.js) |
| CI | [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) |
| Docker | [`Dockerfile`](../../Dockerfile), [`docker-compose.yml`](../../docker-compose.yml) |
| Fluxo de branches | [gitflow.md](gitflow.md) |

## Aprendizado
Teste unitário com mock acha erro de lógica; teste de integração acha erro de ligação entre camadas. Um bug real apareceu na prática: o arredondamento do total da venda.
