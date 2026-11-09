const secret =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production' ? null : 'dev-only-secret');

if (!secret) {
  throw new Error('JWT_SECRET é obrigatório em produção');
}

module.exports = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: secret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
};
