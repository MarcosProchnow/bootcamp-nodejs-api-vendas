const v = require('../../src/validators');

// TDD de unidade pura: tabela de casos válidos e inválidos.
describe('validators', () => {
  test.each([
    ['str', 'name', { name: 'ok' }, true],
    ['str', 'name', { name: '   ' }, false],
    ['str', 'name', {}, false],
    ['str', 'name', { name: 42 }, false],
    ['positiveNumber', 'price', { price: 0.01 }, true],
    ['positiveNumber', 'price', { price: 0 }, false],
    ['positiveNumber', 'price', { price: '5' }, false],
    ['nonNegativeInt', 'stock', { stock: 0 }, true],
    ['nonNegativeInt', 'stock', { stock: -1 }, false],
    ['nonNegativeInt', 'stock', { stock: 1.5 }, false],
    ['positiveInt', 'quantity', { quantity: 1 }, true],
    ['positiveInt', 'quantity', { quantity: 0 }, false],
  ])('%s(%s) com %j => válido: %s', (fn, field, body, valid) => {
    const run = () => v[fn](body, field);
    if (valid) expect(run).not.toThrow();
    else expect(run).toThrow(expect.objectContaining({ message: expect.stringContaining(field) }));
  });

  it('erros de validação carregam status 400', () => {
    let error;
    try {
      v.str({}, 'name');
    } catch (e) {
      error = e;
    }
    expect(error.status).toBe(400);
  });

  it('mensagem de erro (snapshot inline)', () => {
    let error;
    try {
      v.positiveInt({ quantity: 0 }, 'quantity');
    } catch (e) {
      error = e;
    }
    expect({ status: error.status, message: error.message }).toMatchInlineSnapshot(`
{
  "message": "Campo "quantity" deve ser um inteiro maior que zero",
  "status": 400,
}
`);
  });
});
