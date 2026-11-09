const request = require('supertest');
const { createApp } = require('../src/app');

describe('Autenticação', () => {
  it('health check é público', async () => {
    const res = await request(createApp()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('bloqueia rotas protegidas sem token', async () => {
    const res = await request(createApp()).get('/clients');
    expect(res.status).toBe(401);
  });

  it('rejeita token inválido', async () => {
    const res = await request(createApp()).get('/clients').set('Authorization', 'Bearer abc');
    expect(res.status).toBe(401);
  });

  it('registra, faz login e acessa rota protegida', async () => {
    const app = createApp();
    const creds = { username: 'ana', password: '123456' };

    const reg = await request(app).post('/auth/register').send(creds);
    expect(reg.status).toBe(201);
    expect(reg.body).not.toHaveProperty('passwordHash');

    const login = await request(app).post('/auth/login').send(creds);
    expect(login.status).toBe(200);
    expect(login.body.token).toEqual(expect.any(String));

    const res = await request(app).get('/clients').set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
  });

  it('rejeita senha errada e usuário duplicado', async () => {
    const app = createApp();
    const creds = { username: 'ana', password: '123456' };
    await request(app).post('/auth/register').send(creds);

    const wrong = await request(app).post('/auth/login').send({ ...creds, password: 'errada!' });
    expect(wrong.status).toBe(401);

    const dup = await request(app).post('/auth/register').send(creds);
    expect(dup.status).toBe(409);
  });

  it('exige senha com 6+ caracteres', async () => {
    const res = await request(createApp())
      .post('/auth/register')
      .send({ username: 'bia', password: '123' });
    expect(res.status).toBe(400);
  });
});
