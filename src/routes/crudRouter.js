const express = require('express');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Controller + rotas REST para um service. `update: false` omite o PUT.
function createCrudRouter(service, { update = true } = {}) {
  const router = express.Router();

  router.get('/', wrap(async (req, res) => res.json(await service.list(req.query))));
  router.get('/:id', wrap(async (req, res) => res.json(await service.get(req.params.id))));
  router.post('/', wrap(async (req, res) => res.status(201).json(await service.create(req.body))));
  if (update) {
    router.put(
      '/:id',
      wrap(async (req, res) => res.json(await service.update(req.params.id, req.body))),
    );
  }
  router.delete(
    '/:id',
    wrap(async (req, res) => {
      await service.remove(req.params.id);
      res.status(204).end();
    }),
  );

  return router;
}

module.exports = { createCrudRouter, wrap };
