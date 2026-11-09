const { createSalesService } = require('../../src/services/domain');

function makeDeps({ stock = 10, price = 0.1 } = {}) {
  const product = { id: 2, price, stock };
  return {
    repo: {
      create: jest.fn(async (d) => ({ id: 1, ...d })),
      get: jest.fn(),
      remove: jest.fn().mockResolvedValue(true),
    },
    clients: { get: jest.fn().mockResolvedValue({ id: 1 }) },
    products: { get: jest.fn().mockResolvedValue(product) },
    productsRepo: { get: jest.fn().mockResolvedValue(product), update: jest.fn() },
  };
}

const build = (d) => createSalesService(d.repo, d.clients, d.products, d.productsRepo);

describe('salesService (unidade, com mocks)', () => {
  it('arredonda o total para centavos (0.1 * 3 não vira 0.30000000000000004)', async () => {
    const deps = makeDeps({ price: 0.1 });
    const sale = await build(deps).create({ clientId: 1, productId: 2, quantity: 3 });

    expect(0.1 * 3).not.toBe(0.3); // o problema de ponto flutuante que justifica o arredondamento
    expect(sale.total).toBe(0.3);
    expect(Math.abs(sale.total - 0.3)).toBeLessThan(Number.EPSILON);
  });

  it('baixa o estoque pela quantidade vendida', async () => {
    const deps = makeDeps({ stock: 10 });
    await build(deps).create({ clientId: 1, productId: 2, quantity: 4 });
    expect(deps.productsRepo.update).toHaveBeenCalledWith(2, { stock: 6 });
  });

  it('recusa (409) e não altera nada quando o estoque é insuficiente', async () => {
    const deps = makeDeps({ stock: 3 });
    await expect(build(deps).create({ clientId: 1, productId: 2, quantity: 4 })).rejects.toMatchObject({
      status: 409,
    });
    expect(deps.productsRepo.update).not.toHaveBeenCalled();
    expect(deps.repo.create).not.toHaveBeenCalled();
  });

  it('remove a venda devolvendo o estoque', async () => {
    const deps = makeDeps({ stock: 6 });
    deps.repo.get.mockResolvedValue({ id: 9, productId: 2, quantity: 4 });

    await build(deps).remove('9');

    expect(deps.productsRepo.update).toHaveBeenCalledWith(2, { stock: 10 });
    expect(deps.repo.remove).toHaveBeenCalledWith(9);
  });
});
