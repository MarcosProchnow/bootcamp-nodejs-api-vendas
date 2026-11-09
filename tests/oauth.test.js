const request = require('supertest');
const { createApp } = require('../src/app');

const form = { grant_type: 'client_credentials', client_id: 'demo-client', client_secret: 'demo-secret' };

describe('OAuth 2.0 - client credentials', () => {
  it('emite access_token e ele funciona nas rotas protegidas', async () => {
    const app = createApp();
    const res = await request(app).post('/oauth/token').type('form').send(form);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ token_type: 'Bearer', expires_in: 3600 });
    expect(res.headers['cache-control']).toBe('no-store');

    const api = await request(app)
      .get('/clients')
      .set('Authorization', `Bearer ${res.body.access_token}`);
    expect(api.status).toBe(200);
  });

  it('aceita credenciais via HTTP Basic (JSON no body)', async () => {
    const basic = Buffer.from('demo-client:demo-secret').toString('base64');
    const res = await request(createApp())
      .post('/oauth/token')
      .set('Authorization', `Basic ${basic}`)
      .send({ grant_type: 'client_credentials' });
    expect(res.status).toBe(200);
  });

  it('rejeita segredo inválido com invalid_client', async () => {
    const res = await request(createApp())
      .post('/oauth/token')
      .send({ ...form, client_secret: 'errado' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('invalid_client');
  });

  it('rejeita grant_type não suportado', async () => {
    const res = await request(createApp())
      .post('/oauth/token')
      .send({ ...form, grant_type: 'password' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('unsupported_grant_type');
  });
});
