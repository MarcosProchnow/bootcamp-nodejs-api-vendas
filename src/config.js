const isProd = process.env.NODE_ENV === 'production';

const secret = process.env.JWT_SECRET || (isProd ? null : 'dev-only-secret');

if (!secret) {
  throw new Error('JWT_SECRET é obrigatório em produção');
}

// Cliente OAuth 2.0 (client credentials). Em produção só existe se configurado.
let oauthClient = null;
if (process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET) {
  oauthClient = {
    id: process.env.OAUTH_CLIENT_ID,
    secret: process.env.OAUTH_CLIENT_SECRET,
  };
} else if (!isProd) {
  oauthClient = { id: 'demo-client', secret: 'demo-secret' };
}

module.exports = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: secret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  oauthClient,
};
