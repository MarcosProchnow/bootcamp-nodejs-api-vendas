const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { HttpError } = require('../errors');

const digest = (s) => crypto.createHash('sha256').update(String(s)).digest();
const safeEqual = (a, b) => crypto.timingSafeEqual(digest(a), digest(b));

// Módulo 2 - OAuth 2.0, fluxo Client Credentials (RFC 6749 §4.4).
// Mensagens de erro seguem os códigos da RFC: invalid_client, unsupported_grant_type.
function createOAuthService({ oauthClient, jwtSecret }) {
  const expiresIn = 3600;

  function readCredentials(header = '', body = {}) {
    const [type, encoded] = header.split(' ');
    if (type === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString('utf8');
      const i = decoded.indexOf(':');
      return { id: decoded.slice(0, i), secret: decoded.slice(i + 1) };
    }
    return { id: body.client_id, secret: body.client_secret };
  }

  return {
    token(header, body = {}) {
      if (body.grant_type !== 'client_credentials') {
        throw new HttpError(400, 'unsupported_grant_type');
      }
      const { id, secret } = readCredentials(header, body);
      if (!oauthClient || !id || !secret || !safeEqual(id, oauthClient.id) || !safeEqual(secret, oauthClient.secret)) {
        throw new HttpError(401, 'invalid_client');
      }
      const access_token = jwt.sign({ sub: id, scope: body.scope || 'api' }, jwtSecret, { expiresIn });
      return { access_token, token_type: 'Bearer', expires_in: expiresIn };
    },
  };
}

module.exports = { createOAuthService };
