const { setup } = require('./helpers');

describe('CRUD de clientes', () => {
  it('cria, lista, busca, atualiza e remove', async () => {
    const api = await setup();

    const created = await api.post('/clients', { name: 'Maria', email: 'maria@ex.com' });
    expect(created.status).toBe(201);
    const { id } = created.body;

    expect((await api.get('/clients')).body).toHaveLength(1);
    expect((await api.get(`/clients/${id}`)).body.name).toBe('Maria');

    const updated = await api.put(`/clients/${id}`, { name: 'Maria S.', email: 'maria@ex.com' });
    expect(updated.body.name).toBe('Maria S.');

    expect((await api.del(`/clients/${id}`)).status).toBe(204);
    expect((await api.get(`/clients/${id}`)).status).toBe(404);
  });

  it('valida campos obrigatórios e e-mail', async () => {
    const api = await setup();
    expect((await api.post('/clients', { email: 'a@b.com' })).status).toBe(400);
    expect((await api.post('/clients', { name: 'X', email: 'invalido' })).status).toBe(400);
  });

  it('ignora campos desconhecidos no body', async () => {
    const api = await setup();
    const res = await api.post('/clients', { name: 'X', email: 'x@y.com', admin: true });
    expect(res.body).not.toHaveProperty('admin');
  });
});

describe('Produtos e fornecedores', () => {
  it('exige fornecedor existente ao criar produto', async () => {
    const api = await setup();
    const res = await api.post('/products', { name: 'Caneta', price: 2.5, stock: 10, supplierId: 99 });
    expect(res.status).toBe(404);
  });

  it('filtra produtos por supplierId via query string', async () => {
    const api = await setup();
    const s1 = (await api.post('/suppliers', { name: 'A', cnpj: '1' })).body.id;
    const s2 = (await api.post('/suppliers', { name: 'B', cnpj: '2' })).body.id;
    await api.post('/products', { name: 'P1', price: 1, stock: 1, supplierId: s1 });
    await api.post('/products', { name: 'P2', price: 1, stock: 1, supplierId: s2 });

    const res = await api.get(`/products?supplierId=${s1}`);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('P1');
  });

  it('rejeita preço inválido', async () => {
    const api = await setup();
    const s = (await api.post('/suppliers', { name: 'A', cnpj: '1' })).body.id;
    const res = await api.post('/products', { name: 'P', price: -1, stock: 1, supplierId: s });
    expect(res.status).toBe(400);
  });
});
