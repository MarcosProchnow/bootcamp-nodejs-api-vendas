const { createApp } = require('./app');
const config = require('./config');
const logger = require('./logger');
const { createMemoryRepositories } = require('./repositories/memoryRepository');

async function main() {
  const repositories = createMemoryRepositories();

  // DATABASE_URL (ex.: postgres://user:pass@host:5432/db) -> dados relacionais via Sequelize.
  if (process.env.DATABASE_URL) {
    const { Sequelize } = require('sequelize');
    const { createSequelizeRepositories } = require('./repositories/sequelizeRepository');
    const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });
    await sequelize.authenticate();
    Object.assign(repositories, createSequelizeRepositories(sequelize));
    await sequelize.sync();
    logger.info('PostgreSQL conectado (Sequelize)');
  }

  // MONGO_URL (ex.: mongodb://host:27017/vendas) -> ProductInfo e avaliações via Mongoose.
  if (process.env.MONGO_URL) {
    const mongoose = require('mongoose');
    const { createMongooseProductInfoRepository } = require('./repositories/productInfoRepository');
    await mongoose.connect(process.env.MONGO_URL);
    repositories.productInfos = createMongooseProductInfoRepository(mongoose.connection);
    await repositories.productInfos.init();
    logger.info('MongoDB conectado (Mongoose)');
  }

  createApp({ repositories }).listen(config.port, () => {
    logger.info(`API de vendas rodando na porta ${config.port}`);
  });
}

main().catch((err) => {
  logger.error(err.stack || String(err));
  process.exit(1);
});
