# Módulo 2 — Autenticação e Autorização com JavaScript

## Tópicos
Protocolo HTTP, autenticação HTTP (basic, bearer, digest), Base64, JWT, HTTPS/TLS, OAuth 2.0 e OpenID.

## Conceitos
- **HTTP:** sem estado; cookies e sessões simulam estado; mensagens têm método, cabeçalhos e corpo; respostas têm código de status.
- **Basic:** `Authorization: Basic base64(usuario:senha)`. Base64 **não** é criptografia: só é aceitável sobre HTTPS.
- **Bearer/JWT:** token assinado `header.payload.assinatura`; o servidor valida a assinatura e a expiração sem consultar banco. Não coloque dados sensíveis no payload (ele é apenas codificado).
- **Senhas:** nunca em texto puro; hash com salt e função lenta (aqui `scrypt`), comparação em tempo constante (`timingSafeEqual`).
- **HTTPS/TLS:** criptografia simétrica para os dados, assimétrica para a troca de chaves, certificado digital para provar a identidade do servidor.
- **OAuth 2.0:** delegação de acesso. No fluxo *client credentials*, um sistema (não uma pessoa) troca `client_id` + `client_secret` por um `access_token`.
- **OpenID Connect:** camada de identidade sobre o OAuth 2.0 (`id_token`). **Não implementado** neste repositório.

## Onde aparece no projeto
| Assunto | Arquivo |
| --- | --- |
| JWT e Basic | [`src/services/authService.js`](../../src/services/authService.js), [`src/middlewares/authenticate.js`](../../src/middlewares/authenticate.js) |
| OAuth 2.0 client credentials | [`src/services/oauthService.js`](../../src/services/oauthService.js) |
| Testes | `tests/auth.test.js`, `tests/basicAuth.test.js`, `tests/oauth.test.js` |

## Aprendizado
Autenticação (quem é você) e autorização (o que pode fazer) são coisas distintas; o JWT resolve a primeira e carrega informação para a segunda. Segredos vêm de variáveis de ambiente, nunca do código.
