const { createApp } = require('./app');
const config = require('./config');

async function main() {
  let repositories;

  // Com DATABASE_URL (ex.: postgres://user:pass@host:5432/db) persiste via Sequelize;
  // sem ela, usa armazenamento em memória.
  if (process.env.DATABASE_URL) {
    const { Sequelize } = require('sequelize');
    const { createSequelizeRepositories } = require('./repositories/sequelizeRepository');
    const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });
    await sequelize.authenticate();
    repositories = createSequelizeRepositories(sequelize);
    await sequelize.sync();
    console.log('Banco de dados conectado (Sequelize)');
  }

  createApp({ repositories }).listen(config.port, () => {
    console.log(`API de vendas rodando na porta ${config.port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
