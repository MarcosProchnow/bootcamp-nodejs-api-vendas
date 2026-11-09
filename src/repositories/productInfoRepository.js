const { Schema, isValidObjectId } = require('mongoose');

// ProductInfo (NoSQL): descrição, fabricante, dimensões e avaliações do produto.
// Duas implementações da mesma interface: memória e MongoDB (Mongoose).
//   getByProductId, list, create, update, remove, addReview, removeReview

// ---------- memória ----------
function createMemoryProductInfoRepository() {
  const infos = new Map(); // productId -> info
  let nextReviewId = 1;
  const clone = (x) => (x ? structuredClone(x) : null);

  return {
    async init() {},
    async getByProductId(productId) {
      return clone(infos.get(productId));
    },
    async list() {
      return [...infos.values()].map(clone);
    },
    async create(data) {
      const info = { reviews: [], ...data };
      infos.set(info.productId, info);
      return clone(info);
    },
    async update(productId, data) {
      const current = infos.get(productId);
      if (!current) return null;
      Object.assign(current, data);
      return clone(current);
    },
    async remove(productId) {
      return infos.delete(productId);
    },
    async addReview(productId, review) {
      const info = infos.get(productId);
      if (!info) return null;
      info.reviews.push({ id: String(nextReviewId++), ...review });
      return clone(info);
    },
    async removeReview(productId, reviewId) {
      const info = infos.get(productId);
      if (!info) return null;
      info.reviews = info.reviews.filter((r) => r.id !== String(reviewId));
      return clone(info);
    },
  };
}

// ---------- MongoDB / Mongoose ----------
const reviewSchema = new Schema({
  user: { type: String, required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
});

const infoSchema = new Schema({
  productId: { type: Number, required: true, unique: true },
  description: { type: String, required: true },
  manufacturer: String,
  dimensions: { width: Number, height: Number, depth: Number },
  reviews: [reviewSchema],
});

const toPlain = (doc) =>
  doc && {
    productId: doc.productId,
    description: doc.description,
    manufacturer: doc.manufacturer,
    dimensions: doc.dimensions,
    reviews: (doc.reviews || []).map((r) => ({
      id: String(r._id),
      user: r.user,
      score: r.score,
      comment: r.comment,
    })),
  };

// `connection` é uma conexão do Mongoose (mongoose.createConnection ou mongoose.connection).
function createMongooseProductInfoRepository(connection) {
  const Model = connection.model('ProductInfo', infoSchema);
  const opts = { new: true, runValidators: true };

  return {
    init: () => Model.init(), // garante o índice único de productId
    async getByProductId(productId) {
      return toPlain(await Model.findOne({ productId }).lean());
    },
    async list() {
      return (await Model.find().sort({ productId: 1 }).lean()).map(toPlain);
    },
    async create(data) {
      return toPlain((await Model.create(data)).toObject());
    },
    async update(productId, data) {
      return toPlain(await Model.findOneAndUpdate({ productId }, { $set: data }, opts).lean());
    },
    async remove(productId) {
      return (await Model.deleteOne({ productId })).deletedCount > 0;
    },
    async addReview(productId, review) {
      return toPlain(
        await Model.findOneAndUpdate({ productId }, { $push: { reviews: review } }, opts).lean(),
      );
    },
    async removeReview(productId, reviewId) {
      if (!isValidObjectId(reviewId)) return this.getByProductId(productId);
      return toPlain(
        await Model.findOneAndUpdate(
          { productId },
          { $pull: { reviews: { _id: reviewId } } },
          { new: true },
        ).lean(),
      );
    },
  };
}

module.exports = { createMemoryProductInfoRepository, createMongooseProductInfoRepository };
