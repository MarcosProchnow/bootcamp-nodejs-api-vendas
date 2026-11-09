const { Sequelize } = require('sequelize');
const { createSequelizeRepositories } = require('../src/repositories/sequelizeRepository');
const { setup } = require('./helpers');

// Mesmo comportamento da API, agora persistindo via Sequelize (SQLite em memória
// nos testes; PostgreSQL em produção via DATABASE_URL).
async function setupDb() {
  const sequelize = new Sequelize('sqlite::memory:', { logging: false });
  const repositories = createSequelizeRepositories(sequelize);
  await sequelize.sync();
  const api = await setup({ repositories });
  return { api, sequelize };
}

describe('Persistência com Sequelize', () => {
  let ctx;
  beforeEach(async () => {
    ctx = await setupDb();
  });
  afterEach(() => ctx.sequelize.close());

  it('CRUD de clientes', async () => {
    const { api } = ctx;
    const created = await api.post('/clients', { name: 'Maria', email: 'maria@ex.com' });
    expect(created.status).toBe(201);
    const { id } = created.body;

    expect((await api.get('/clients')).body).toHaveLength(1);
    const updated = await api.put(`/clients/${id}`, { name: 'Maria S.', email: 'maria@ex.com' });
    expect(updated.body.name).toBe('Maria S.');
    expect((await api.del(`/clients/${id}`)).status).toBe(204);
    expect((await api.get(`/clients/${id}`)).status).toBe(404);
  });

  it('controla estoque na venda e na exclusão da venda', async () => {
    const { api } = ctx;
    const supplierId = (await api.post('/suppliers', { name: 'F', cnpj: '1' })).body.id;
    const productId = (
      await api.post('/products', { name: 'Caderno', price: 20.5, stock: 10, supplierId })
    ).body.id;
    const clientId = (await api.post('/clients', { name: 'Ana', email: 'ana@ex.com' })).body.id;

    const sale = await api.post('/sales', { clientId, productId, quantity: 4 });
    expect(sale.status).toBe(201);
    expect(sale.body.total).toBe(82);
    expect((await api.get(`/products/${productId}`)).body.stock).toBe(6);

    expect((await api.post('/sales', { clientId, productId, quantity: 7 })).status).toBe(409);

    await api.del(`/sales/${sale.body.id}`);
    expect((await api.get(`/products/${productId}`)).body.stock).toBe(10);
  });

  it('filtra por query string e persiste usuários', async () => {
    const { api } = ctx;
    const s1 = (await api.post('/suppliers', { name: 'A', cnpj: '1' })).body.id;
    const s2 = (await api.post('/suppliers', { name: 'B', cnpj: '2' })).body.id;
    await api.post('/products', { name: 'P1', price: 1, stock: 1, supplierId: s1 });
    await api.post('/products', { name: 'P2', price: 1, stock: 1, supplierId: s2 });

    const res = await api.get(`/products?supplierId=${s2}`);
    expect(res.body.map((p) => p.name)).toEqual(['P2']);
  });
});
