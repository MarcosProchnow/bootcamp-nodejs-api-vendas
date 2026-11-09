const { createCrudService } = require('../../src/services/crudService');

// Mock do repository: o service é testado isolado, sem banco nem HTTP.
function makeRepo(overrides = {}) {
  return {
    list: jest.fn().mockResolvedValue([]),
    get: jest.fn().mockResolvedValue(null),
    create: jest.fn(async (d) => ({ id: 1, ...d })),
    update: jest.fn(async (id, d) => ({ id, ...d })),
    remove: jest.fn().mockResolvedValue(true),
    ...overrides,
  };
}

const options = { fields: ['name'], validate: jest.fn(), resourceName: 'Item' };

describe('crudService', () => {
  beforeEach(() => options.validate.mockClear());

  it('create valida e persiste só os campos permitidos', async () => {
    const repo = makeRepo();
    const service = createCrudService(repo, options);

    const created = await service.create({ name: 'a', admin: true });

    expect(options.validate).toHaveBeenCalledWith({ name: 'a', admin: true });
    expect(repo.create).toHaveBeenCalledWith({ name: 'a' });
    expect(created).toEqual({ id: 1, name: 'a' });
  });

  it('não persiste quando a validação falha', async () => {
    const repo = makeRepo();
    options.validate.mockImplementationOnce(() => {
      throw new Error('inválido');
    });
    await expect(createCrudService(repo, options).create({})).rejects.toThrow('inválido');
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('get converte o id para número e lança 404 se não existe', async () => {
    const repo = makeRepo();
    const service = createCrudService(repo, options);

    await expect(service.get('7')).rejects.toMatchObject({ status: 404, message: 'Item não encontrado(a)' });
    expect(repo.get).toHaveBeenCalledWith(7);
  });

  it('update e remove exigem registro existente', async () => {
    const repo = makeRepo({ get: jest.fn().mockResolvedValue({ id: 3, name: 'x' }) });
    const service = createCrudService(repo, options);

    await service.update('3', { name: 'novo' });
    expect(repo.update).toHaveBeenCalledWith(3, { name: 'novo' });

    await service.remove('3');
    expect(repo.remove).toHaveBeenCalledWith(3);
  });
});
