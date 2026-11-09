const express = require('express');
const { wrap } = require('./crudRouter');

// Montado em /products/:id → /info e /reviews (dados NoSQL do produto).
function createProductInfoRouter(service) {
  const router = express.Router({ mergeParams: true });

  router.get('/info', wrap(async (req, res) => res.json(await service.get(req.params.id))));
  router.post('/info', wrap(async (req, res) => res.status(201).json(await service.create(req.params.id, req.body))));
  router.put('/info', wrap(async (req, res) => res.json(await service.update(req.params.id, req.body))));
  router.delete('/info', wrap(async (req, res) => {
    await service.remove(req.params.id);
    res.status(204).end();
  }));

  router.post('/reviews', wrap(async (req, res) => res.status(201).json(await service.addReview(req.params.id, req.body))));
  router.delete('/reviews/:reviewId', wrap(async (req, res) => {
    res.json(await service.removeReview(req.params.id, req.params.reviewId));
  }));

  return router;
}

module.exports = { createProductInfoRouter };
