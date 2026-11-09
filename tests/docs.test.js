const request = require('supertest');
const { createApp } = require('../src/app');
const logger = require('../src/logger');

describe('Documentação e logs', () => {
  it('serve o Swagger UI sem autenticação', async () => {
    const res = await request(createApp()).get('/api-docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger-ui');
  });

  it('o logger winston fica silencioso nos testes', () => {
    expect(logger.silent).toBe(true);
  });

  it('rotas desconhecidas exigem autenticação antes do 404', async () => {
    const res = await request(createApp()).get('/nada');
    expect(res.status).toBe(401);
  });
});
