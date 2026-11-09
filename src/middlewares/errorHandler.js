const { HttpError } = require('../errors');

function notFound(req, res, next) {
  next(new HttpError(404, 'Rota não encontrada'));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? 'Erro interno' : err.message });
}

module.exports = { notFound, errorHandler };
