const { setup } = require('./helpers');

async function seed(api, stock = 10) {
  const supplierId = (await api.post('/suppliers', { name: 'Forn', cnpj: '1' })).body.id;
  const productId = (
    await api.post('/products', { name: 'Caderno', price: 20, stock, supplierId })
  ).body.id;
  const clientId = (await api.post('/clients', { name: 'Ana', email: 'ana@ex.com' })).body.id;
  return { productId, clientId };
}

describe('Vendas e controle de estoque', () => {
  it('registra venda, calcula total e baixa o estoque', async () => {
    const api = await setup();
    const { productId, clientId } = await seed(api);

    const sale = await api.post('/sales', { clientId, productId, quantity: 4 });
    expect(sale.status).toBe(201);
    expect(sale.body.total).toBe(80);
    expect((await api.get(`/products/${productId}`)).body.stock).toBe(6);
  });

  it('recusa venda com estoque insuficiente (409)', async () => {
    const api = await setup();
    const { productId, clientId } = await seed(api, 3);

    const res = await api.post('/sales', { clientId, productId, quantity: 4 });
    expect(res.status).toBe(409);
    expect((await api.get(`/products/${productId}`)).body.stock).toBe(3);
  });

  it('devolve o estoque ao excluir a venda', async () => {
    const api = await setup();
    const { productId, clientId } = await seed(api);

    const sale = await api.post('/sales', { clientId, productId, quantity: 4 });
    expect((await api.del(`/sales/${sale.body.id}`)).status).toBe(204);
    expect((await api.get(`/products/${productId}`)).body.stock).toBe(10);
  });

  it('exige cliente e produto existentes', async () => {
    const api = await setup();
    const { productId } = await seed(api);
    expect((await api.post('/sales', { clientId: 99, productId, quantity: 1 })).status).toBe(404);
  });

  it('não expõe PUT em vendas', async () => {
    const api = await setup();
    expect((await api.put('/sales/1', {})).status).toBe(404);
  });
});
