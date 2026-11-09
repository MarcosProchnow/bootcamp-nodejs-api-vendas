const request = require('supertest');
const { createApp } = require('../src/app');
const { setup } = require('./helpers');

describe('GraphQL', () => {
  it('exige autenticação', async () => {
    const res = await request(createApp()).post('/graphql').send({ query: '{ clients { id } }' });
    expect(res.status).toBe(401);
  });

  it('cria cliente via mutation e consulta via query', async () => {
    const api = await setup();
    const created = await api.graphql(
      'mutation { createClient(name: "Ana", email: "ana@ex.com") { id name } }',
    );
    expect(created.body.data.createClient.name).toBe('Ana');

    const res = await api.graphql('{ clients { name email } }');
    expect(res.body.data.clients).toEqual([{ name: 'Ana', email: 'ana@ex.com' }]);
  });

  it('resolve relação produto → fornecedor e filtra por supplierId', async () => {
    const api = await setup();
    const s1 = (await api.post('/suppliers', { name: 'Forn A', cnpj: '1' })).body.id;
    const s2 = (await api.post('/suppliers', { name: 'Forn B', cnpj: '2' })).body.id;
    await api.post('/products', { name: 'P1', price: 5, stock: 3, supplierId: s1 });
    await api.post('/products', { name: 'P2', price: 7, stock: 2, supplierId: s2 });

    const res = await api.graphql(`{ products(supplierId: ${s2}) { name supplier { name } } }`);
    expect(res.body.data.products).toEqual([{ name: 'P2', supplier: { name: 'Forn B' } }]);
  });

  it('devolve erros GraphQL para dados inválidos', async () => {
    const api = await setup();
    const res = await api.graphql('mutation { createClient(name: "X", email: "invalido") { id } }');
    expect(res.body.errors[0].message).toMatch(/E-mail inválido/);
  });
});
