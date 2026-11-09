# Fluxo de Git usado neste repositório

Variação enxuta de **GitHub Flow / Trunk Based**, adequada a um projeto individual:

1. `main` está sempre estável (o CI precisa estar verde).
2. Cada mudança nasce em uma branch curta `feature/<assunto>`.
3. Commits pequenos, mensagem no formato `tipo: descrição` (`feat`, `fix`, `docs`, `build`, `test`).
4. Abre-se um **Pull Request** para `main`; o CI roda lint e testes em Node 18 e 20 (com MongoDB como service container).
5. Com o CI verde e após revisão, o PR é integrado por *squash merge* e a branch é apagada.

## Comparação
| | GitFlow | Trunk Based | Este repositório |
| --- | --- | --- | --- |
| Branches longas | `develop`, `release`, `hotfix` | só `main` | só `main` |
| Branches de feature | longas | muito curtas | curtas |
| Bom para | releases versionadas e equipes grandes | entrega contínua | projeto pequeno com CI |

Pull Requests: <https://github.com/MarcosProchnow/bootcamp-nodejs-api-vendas/pulls>
