const request = require('supertest');
const { createApp } = require('../src/app');

// Cria uma app isolada e devolve um cliente HTTP já autenticado.
// `options` é repassado a createApp (ex.: { repositories }).
async function setup(options) {
  const app = createApp(options);
  const credentials = { username: 'aluno', password: 'senha123' };
  await request(app).post('/auth/register').send(credentials);
  const { body } = await request(app).post('/auth/login').send(credentials);
  const auth = { Authorization: `Bearer ${body.token}` };

  return {
    app,
    auth,
    get: (url) => request(app).get(url).set(auth),
    post: (url, data) => request(app).post(url).set(auth).send(data),
    put: (url, data) => request(app).put(url).set(auth).send(data),
    del: (url) => request(app).delete(url).set(auth),
    graphql: (query) => request(app).post('/graphql').set(auth).send({ query }),
  };
}

module.exports = { setup };
