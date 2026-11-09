const { defineModels } = require('../db/models');

// Mesma interface do memoryRepository (list/get/create/update/remove),
// por isso services, rotas e GraphQL não mudam ao trocar o armazenamento.
function createSequelizeRepository(Model) {
  return {
    list: (filter = {}) => Model.findAll({ where: filter, raw: true, order: [['id', 'ASC']] }),

    get: (id) => Model.findByPk(id, { raw: true }),

    async create(data) {
      const created = await Model.create(data);
      return created.get({ plain: true });
    },

    async update(id, data) {
      const [count] = await Model.update(data, { where: { id } });
      if (!count) return null;
      return Model.findByPk(id, { raw: true });
    },

    async remove(id) {
      return (await Model.destroy({ where: { id } })) > 0;
    },
  };
}

function createSequelizeRepositories(sequelize) {
  const m = defineModels(sequelize);
  return {
    clients: createSequelizeRepository(m.Client),
    suppliers: createSequelizeRepository(m.Supplier),
    products: createSequelizeRepository(m.Product),
    sales: createSequelizeRepository(m.Sale),
    users: createSequelizeRepository(m.User),
  };
}

module.exports = { createSequelizeRepository, createSequelizeRepositories };
