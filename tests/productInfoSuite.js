// Suíte compartilhada: o mesmo comportamento é verificado com o repository em
// memória e com o MongoDB (Mongoose). `makeApi` devolve { api, cleanup }.
function runProductInfoSuite(name, makeApi, describeFn = describe) {
  describeFn(name, () => {
    let api;
    let cleanup;
    let productId;

    beforeEach(async () => {
      ({ api, cleanup } = await makeApi());
      const supplierId = (await api.post('/suppliers', { name: 'F', cnpj: '1' })).body.id;
      productId = (
        await api.post('/products', { name: 'Notebook', price: 3000, stock: 5, supplierId })
      ).body.id;
    });
    afterEach(() => cleanup());

    const info = { description: 'Notebook 14"', manufacturer: 'ACME', dimensions: { width: 32, height: 2, depth: 22 } };

    it('cria, consulta, atualiza e remove as informações', async () => {
      const created = await api.post(`/products/${productId}/info`, info);
      expect(created.status).toBe(201);
      expect(created.body).toMatchObject({ productId, description: 'Notebook 14"', reviews: [] });

      expect((await api.get(`/products/${productId}/info`)).body.manufacturer).toBe('ACME');

      const updated = await api.put(`/products/${productId}/info`, { description: 'Notebook 15"' });
      expect(updated.body.description).toBe('Notebook 15"');
      expect(updated.body.manufacturer).toBe('ACME');

      expect((await api.del(`/products/${productId}/info`)).status).toBe(204);
      expect((await api.get(`/products/${productId}/info`)).status).toBe(404);
    });

    it('recusa informações duplicadas (409) e produto inexistente (404)', async () => {
      await api.post(`/products/${productId}/info`, info);
      expect((await api.post(`/products/${productId}/info`, info)).status).toBe(409);
      expect((await api.post('/products/999/info', info)).status).toBe(404);
    });

    it('valida os campos', async () => {
      expect((await api.post(`/products/${productId}/info`, {})).status).toBe(400);
    });

    it('adiciona e remove avaliações', async () => {
      await api.post(`/products/${productId}/info`, info);

      const r1 = await api.post(`/products/${productId}/reviews`, { user: 'ana', score: 5, comment: 'ótimo' });
      expect(r1.status).toBe(201);
      const r2 = await api.post(`/products/${productId}/reviews`, { user: 'bia', score: 3 });
      expect(r2.body.reviews).toHaveLength(2);

      const reviewId = r2.body.reviews[0].id;
      const removed = await api.del(`/products/${productId}/reviews/${reviewId}`);
      expect(removed.status).toBe(200);
      expect(removed.body.reviews.map((r) => r.user)).toEqual(['bia']);

      expect((await api.del(`/products/${productId}/reviews/${reviewId}`)).status).toBe(404);
    });

    it('valida a nota da avaliação (1 a 5)', async () => {
      await api.post(`/products/${productId}/info`, info);
      expect((await api.post(`/products/${productId}/reviews`, { user: 'ana', score: 9 })).status).toBe(400);
    });

    it('o endpoint de produto continua funcionando', async () => {
      expect((await api.get(`/products/${productId}`)).body.name).toBe('Notebook');
    });
  });
}

module.exports = { runProductInfoSuite };
