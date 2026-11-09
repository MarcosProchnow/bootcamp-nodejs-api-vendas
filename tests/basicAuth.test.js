const request = require('supertest');
const { createApp } = require('../src/app');

const basic = (u, p) => `Basic ${Buffer.from(`${u}:${p}`).toString('base64')}`;

describe('Autenticação HTTP Basic', () => {
  it('identifica o usuário com credenciais válidas', async () => {
    const app = createApp();
    await request(app).post('/auth/register').send({ username: 'ana', password: '123456' });
    const res = await request(app).get('/auth/basic').set('Authorization', basic('ana', '123456'));
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('ana');
  });

  it('rejeita senha errada e cabeçalho ausente', async () => {
    const app = createApp();
    await request(app).post('/auth/register').send({ username: 'ana', password: '123456' });
    expect(
      (await request(app).get('/auth/basic').set('Authorization', basic('ana', 'x'))).status,
    ).toBe(401);
    expect((await request(app).get('/auth/basic')).status).toBe(401);
  });

  it('serve a documentação OpenAPI sem autenticação', async () => {
    const res = await request(createApp()).get('/docs/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.0.3');
  });
});
