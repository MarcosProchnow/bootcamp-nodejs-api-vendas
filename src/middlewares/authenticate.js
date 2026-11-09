const jwt = require('jsonwebtoken');
const { HttpError } = require('../errors');

module.exports = (secret) => (req, res, next) => {
  const [type, token] = (req.headers.authorization || '').split(' ');
  if (type !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Token ausente'));
  }
  try {
    req.user = jwt.verify(token, secret);
    return next();
  } catch {
    return next(new HttpError(401, 'Token inválido ou expirado'));
  }
};
