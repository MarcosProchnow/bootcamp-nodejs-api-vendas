const mongoose = require('mongoose');
const { setup } = require('./helpers');
const { runProductInfoSuite } = require('./productInfoSuite');
const { createMemoryRepositories } = require('../src/repositories/memoryRepository');
const {
  createMongooseProductInfoRepository,
} = require('../src/repositories/productInfoRepository');

// Sempre roda: repository em memória.
runProductInfoSuite('ProductInfo / avaliações (memória)', async () => ({
  api: await setup(),
  cleanup: async () => {},
}));

// Roda quando há um MongoDB disponível (no CI via service container).
// Localmente: MONGO_URL=mongodb://localhost:27017 npm test
const mongoUrl = process.env.MONGO_URL;
runProductInfoSuite(
  'ProductInfo / avaliações (MongoDB + Mongoose)',
  async () => {
    const dbName = `test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const connection = await mongoose.createConnection(mongoUrl, { dbName }).asPromise();
    const productInfos = createMongooseProductInfoRepository(connection);
    await productInfos.init();
    const api = await setup({ repositories: { ...createMemoryRepositories(), productInfos } });
    return {
      api,
      cleanup: async () => {
        await connection.dropDatabase();
        await connection.close();
      },
    };
  },
  mongoUrl ? describe : describe.skip,
);
