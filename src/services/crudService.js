const { HttpError } = require('../errors');

// Service genérico: regras de validação ficam em `validate`, `fields` limita
// quais campos do body são persistidos.
function createCrudService(repo, { fields, validate, resourceName = 'Registro' }) {
  const pick = (body) =>
    Object.fromEntries(fields.filter((f) => f in body).map((f) => [f, body[f]]));

  const service = {
    list: (query) => repo.list(query),

    async get(id) {
      const item = await repo.get(Number(id));
      if (!item) throw new HttpError(404, `${resourceName} não encontrado(a)`);
      return item;
    },

    async create(body) {
      await validate(body);
      return repo.create(pick(body));
    },

    async update(id, body) {
      await service.get(id);
      await validate(body);
      return repo.update(Number(id), pick(body));
    },

    async remove(id) {
      await service.get(id);
      await repo.remove(Number(id));
    },
  };
  return service;
}

module.exports = { createCrudService };
