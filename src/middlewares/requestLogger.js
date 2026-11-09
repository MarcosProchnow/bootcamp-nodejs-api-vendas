// Módulo 1 - gravação de logs: uma linha por requisição (silencioso nos testes).
module.exports = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next();
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  return next();
};
