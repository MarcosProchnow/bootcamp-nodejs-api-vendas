const path = require('path');
const express = require('express');
const cors = require('cors');
const requestLogger = require('./middlewares/requestLogger');
const config = require('./config');
const authenticate = require('./middlewares/authenticate');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const { createMemoryRepository } = require('./repositories/memoryRepository');
const { createAuthService } = require('./services/authService');
const {
  createClientsService,
  createSuppliersService,
  createProductsService,
  createSalesService,
} = require('./services/domain');
const { createCrudRouter, wrap } = require('./routes/crudRouter');

// Factory: cada chamada cria uma instância isolada (repositories novos),
// o que deixa os testes independentes entre si.
function createApp() {
  const clientsRepo = createMemoryRepository();
  const suppliersRepo = createMemoryRepository();
  const productsRepo = createMemoryRepository();
  const salesRepo = createMemoryRepository();
  const usersRepo = createMemoryRepository();

  const clients = createClientsService(clientsRepo);
  const suppliers = createSuppliersService(suppliersRepo);
  const products = createProductsService(productsRepo, suppliers);
  const sales = createSalesService(salesRepo, clients, products, productsRepo);
  const auth = createAuthService(usersRepo, config);

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);
  app.use('/docs', express.static(path.join(__dirname, '..', 'docs')));

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  const authRouter = express.Router();
  authRouter.post('/register', wrap(async (req, res) => res.status(201).json(await auth.register(req.body))));
  authRouter.post('/login', wrap(async (req, res) => res.json(await auth.login(req.body))));
  authRouter.get('/basic', wrap(async (req, res) => res.json(await auth.whoamiBasic(req.headers.authorization))));
  app.use('/auth', authRouter);

  app.use(authenticate(config.jwtSecret));
  app.use('/clients', createCrudRouter(clients));
  app.use('/suppliers', createCrudRouter(suppliers));
  app.use('/products', createCrudRouter(products));
  app.use('/sales', createCrudRouter(sales, { update: false }));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
