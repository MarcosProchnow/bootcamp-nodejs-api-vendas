const path = require('path');
const express = require('express');
const cors = require('cors');
const config = require('./config');
const requestLogger = require('./middlewares/requestLogger');
const authenticate = require('./middlewares/authenticate');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const { createMemoryRepositories } = require('./repositories/memoryRepository');
const { createAuthService } = require('./services/authService');
const { createOAuthService } = require('./services/oauthService');
const {
  createClientsService,
  createSuppliersService,
  createProductsService,
  createSalesService,
} = require('./services/domain');
const { createCrudRouter, wrap } = require('./routes/crudRouter');
const { createGraphqlHandler } = require('./graphql/handler');

// Factory: cada chamada cria uma instância isolada. Por padrão usa repositories
// em memória; passe `repositories` (ex.: Sequelize) para persistir em banco.
function createApp({ repositories } = {}) {
  const repos = repositories || createMemoryRepositories();

  const clients = createClientsService(repos.clients);
  const suppliers = createSuppliersService(repos.suppliers);
  const products = createProductsService(repos.products, suppliers);
  const sales = createSalesService(repos.sales, clients, products, repos.products);
  const auth = createAuthService(repos.users, config);
  const oauth = createOAuthService(config);

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(requestLogger);
  app.use('/docs', express.static(path.join(__dirname, '..', 'docs')));

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  const authRouter = express.Router();
  authRouter.post('/register', wrap(async (req, res) => res.status(201).json(await auth.register(req.body))));
  authRouter.post('/login', wrap(async (req, res) => res.json(await auth.login(req.body))));
  authRouter.get('/basic', wrap(async (req, res) => res.json(await auth.whoamiBasic(req.headers.authorization))));
  app.use('/auth', authRouter);

  app.post('/oauth/token', wrap(async (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(oauth.token(req.headers.authorization, req.body));
  }));

  app.use(authenticate(config.jwtSecret));
  app.all('/graphql', createGraphqlHandler({ clients, suppliers, products, sales }));
  app.use('/clients', createCrudRouter(clients));
  app.use('/suppliers', createCrudRouter(suppliers));
  app.use('/products', createCrudRouter(products));
  app.use('/sales', createCrudRouter(sales, { update: false }));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
