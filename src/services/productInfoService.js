const { HttpError } = require('../errors');
const v = require('../validators');

const INFO_FIELDS = ['description', 'manufacturer', 'dimensions'];

function validateInfo(body) {
  v.str(body, 'description');
  if ('manufacturer' in body && typeof body.manufacturer !== 'string') {
    throw new HttpError(400, 'Campo "manufacturer" deve ser texto');
  }
  if ('dimensions' in body && (typeof body.dimensions !== 'object' || body.dimensions === null)) {
    throw new HttpError(400, 'Campo "dimensions" deve ser um objeto');
  }
}

function pickInfo(body) {
  return Object.fromEntries(INFO_FIELDS.filter((f) => f in body).map((f) => [f, body[f]]));
}

function createProductInfoService(repo, productsService) {
  // 404 se o produto (SQL) não existe: liga o banco relacional ao NoSQL.
  const productIdOf = async (id) => (await productsService.get(id)).id;

  const service = {
    async get(id) {
      const info = await repo.getByProductId(await productIdOf(id));
      if (!info) throw new HttpError(404, 'Informações do produto não encontradas');
      return info;
    },

    async create(id, body) {
      const productId = await productIdOf(id);
      validateInfo(body);
      if (await repo.getByProductId(productId)) {
        throw new HttpError(409, 'Produto já possui informações');
      }
      return repo.create({ productId, ...pickInfo(body) });
    },

    async update(id, body) {
      const productId = await productIdOf(id);
      validateInfo(body);
      const updated = await repo.update(productId, pickInfo(body));
      if (!updated) throw new HttpError(404, 'Informações do produto não encontradas');
      return updated;
    },

    async remove(id) {
      const removed = await repo.remove(await productIdOf(id));
      if (!removed) throw new HttpError(404, 'Informações do produto não encontradas');
    },

    async addReview(id, body) {
      const productId = await productIdOf(id);
      v.str(body, 'user');
      if (!Number.isInteger(body.score) || body.score < 1 || body.score > 5) {
        throw new HttpError(400, 'Campo "score" deve ser um inteiro de 1 a 5');
      }
      if ('comment' in body && typeof body.comment !== 'string') {
        throw new HttpError(400, 'Campo "comment" deve ser texto');
      }
      const updated = await repo.addReview(productId, {
        user: body.user,
        score: body.score,
        comment: body.comment,
      });
      if (!updated) throw new HttpError(404, 'Informações do produto não encontradas');
      return updated;
    },

    async removeReview(id, reviewId) {
      const info = await service.get(id);
      if (!info.reviews.some((r) => r.id === String(reviewId))) {
        throw new HttpError(404, 'Avaliação não encontrada');
      }
      return repo.removeReview(info.productId, reviewId);
    },
  };
  return service;
}

module.exports = { createProductInfoService };
