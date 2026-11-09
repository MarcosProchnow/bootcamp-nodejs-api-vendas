// Repository em memória. A interface (list/get/create/update/remove) é a mesma
// que um repository com pg, Sequelize ou Mongoose implementaria.
function createMemoryRepository() {
  const items = new Map();
  let nextId = 1;

  return {
    async list(filter = {}) {
      return [...items.values()].filter((item) =>
        Object.entries(filter).every(([k, v]) => String(item[k]) === String(v)),
      );
    },
    async get(id) {
      return items.get(id) || null;
    },
    async create(data) {
      const item = { id: nextId++, ...data };
      items.set(item.id, item);
      return item;
    },
    async update(id, data) {
      const current = items.get(id);
      if (!current) return null;
      const updated = { ...current, ...data, id };
      items.set(id, updated);
      return updated;
    },
    async remove(id) {
      return items.delete(id);
    },
  };
}

function createMemoryRepositories() {
  return {
    clients: createMemoryRepository(),
    suppliers: createMemoryRepository(),
    products: createMemoryRepository(),
    sales: createMemoryRepository(),
    users: createMemoryRepository(),
  };
}

module.exports = { createMemoryRepository, createMemoryRepositories };
