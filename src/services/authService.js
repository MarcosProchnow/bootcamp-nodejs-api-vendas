const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { HttpError } = require('../errors');
const v = require('../validators');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const candidate = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
}

function createAuthService(usersRepo, { jwtSecret, jwtExpiresIn }) {
  async function authenticate({ username, password }) {
    const [user] = await usersRepo.list({ username });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw new HttpError(401, 'Credenciais inválidas');
    }
    return user;
  }

  return {
    async register(body) {
      v.str(body, 'username');
      v.str(body, 'password');
      if (body.password.length < 6) {
        throw new HttpError(400, 'A senha deve ter ao menos 6 caracteres');
      }
      const [existing] = await usersRepo.list({ username: body.username });
      if (existing) throw new HttpError(409, 'Usuário já existe');
      const user = await usersRepo.create({
        username: body.username,
        passwordHash: hashPassword(body.password),
      });
      return { id: user.id, username: user.username };
    },

    // Login com JSON -> devolve um JWT (Bearer)
    async login(body) {
      v.str(body, 'username');
      v.str(body, 'password');
      const user = await authenticate(body);
      const token = jwt.sign({ sub: user.id, username: user.username }, jwtSecret, {
        expiresIn: jwtExpiresIn,
      });
      return { token };
    },

    // Autenticação HTTP Basic: "Authorization: Basic base64(usuario:senha)"
    async whoamiBasic(header = '') {
      const [type, encoded] = header.split(' ');
      if (type !== 'Basic' || !encoded) throw new HttpError(401, 'Cabeçalho Basic ausente');
      const decoded = Buffer.from(encoded, 'base64').toString('utf8');
      const i = decoded.indexOf(':');
      if (i < 0) throw new HttpError(401, 'Credenciais Basic malformadas');
      const user = await authenticate({
        username: decoded.slice(0, i),
        password: decoded.slice(i + 1),
      });
      return { id: user.id, username: user.username };
    },
  };
}

module.exports = { createAuthService };
