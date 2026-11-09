const request = require('supertest');
const { createApp } = require('../src/app');

// Cria uma app isolada e devolve um cliente HTTP já autenticado.
async function setup() {
  const app = createApp();
  const credentials = { username: 'aluno', password: 'senha123' };
  await request(app).post('/auth/register').send(credentials);
  const { body } = await request(app).post('/auth/login').send(credentials);
  const auth = { Authorization: `Bearer ${body.token}` };

  return {
    app,
    get: (url) => request(app).get(url).set(auth),
    post: (url, data) => request(app).post(url).set(auth).send(data),
    put: (url, data) => request(app).put(url).set(auth).send(data),
    del: (url) => request(app).delete(url).set(auth),
  };
}

module.exports = { setup };
