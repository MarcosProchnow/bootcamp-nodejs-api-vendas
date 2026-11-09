# Módulo 0 — Fundamentos de Front End

## Tópicos
Preparação do ambiente, HTML, CSS (partes I e II) e JavaScript no navegador.

## Conceitos
- **HTML semântico:** `header`, `main`, `section`, `form`, `label` associado ao `input` (acessibilidade).
- **CSS:** variáveis (`--accent`), `box-sizing`, flex e grid, media query para telas pequenas.
- **JavaScript no navegador:** DOM, eventos, `fetch` com `async/await`, `FormData`.
- **Segurança básica:** usar `textContent` (não `innerHTML`) para não permitir injeção de HTML/XSS; não guardar o token em `localStorage` quando não é necessário.

## Onde aparece no projeto
Painel em [`public/`](../../public) servido em `/app`: login com JWT, cadastro, listagem e criação de clientes, listagem de produtos. Teste em [`tests/frontend.test.js`](../../tests/frontend.test.js).

## Aprendizado
O front end é só mais um cliente da API: tudo o que ele faz passa pelas mesmas rotas, validações e autenticação do back end.
