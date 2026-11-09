const { HttpError } = require('../errors');
const logger = require('../logger');

function notFound(req, res, next) {
  next(new HttpError(404, 'Rota não encontrada'));
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  if (status === 500) logger.error(err.stack || String(err));
  res.status(status).json({ error: status === 500 ? 'Erro interno' : err.message });
}

module.exports = { notFound, errorHandler };
