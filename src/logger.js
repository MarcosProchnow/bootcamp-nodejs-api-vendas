const winston = require('winston');

// Módulo 1 - gravação de logs com winston.
// Em produção: JSON (fácil de indexar). Em desenvolvimento: texto legível. Silencioso nos testes.
const isProd = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  silent: process.env.NODE_ENV === 'test',
  format: isProd
    ? winston.format.json()
    : winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level.toUpperCase()} ${message}`),
      ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
