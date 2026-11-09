const request = require('supertest');
const { createApp } = require('../src/app');

describe('Painel front end (Módulo 0)', () => {
  it('serve o HTML sem autenticação', async () => {
    const res = await request(createApp()).get('/app/');
    expect(res.status).toBe(200);
    expect(res.type).toBe('text/html');
    expect(res.text).toContain('<title>API de Vendas');
  });

  it('serve CSS e JavaScript', async () => {
    const app = createApp();
    expect((await request(app).get('/app/style.css')).status).toBe(200);
    expect((await request(app).get('/app/app.js')).status).toBe(200);
  });
});
