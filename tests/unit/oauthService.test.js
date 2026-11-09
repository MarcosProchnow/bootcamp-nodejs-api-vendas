const { createOAuthService } = require('../../src/services/oauthService');

const service = createOAuthService({ oauthClient: { id: 'app', secret: 'segredo' }, jwtSecret: 's3' });
const creds = { grant_type: 'client_credentials', client_id: 'app', client_secret: 'segredo' };

function catchError(fn) {
  try {
    fn();
  } catch (e) {
    return e;
  }
  return null;
}

describe('oauthService', () => {
  it('emite um access_token JWT (matcher customizado toBeJwt)', () => {
    const res = service.token(undefined, creds);
    expect(res.access_token).toBeJwt();
    expect(res).toMatchObject({ token_type: 'Bearer', expires_in: 3600 });
  });

  it('rejeita segredo incorreto e cliente ausente', () => {
    expect(catchError(() => service.token(undefined, { ...creds, client_secret: 'x' }))).toMatchObject({
      status: 401,
      message: 'invalid_client',
    });
    expect(catchError(() => service.token(undefined, { grant_type: 'client_credentials' }))).toMatchObject({
      status: 401,
    });
  });

  it('rejeita grant_type não suportado', () => {
    expect(catchError(() => service.token(undefined, { ...creds, grant_type: 'password' }))).toMatchObject({
      status: 400,
      message: 'unsupported_grant_type',
    });
  });

  it('sem cliente configurado nenhum token é emitido', () => {
    const closed = createOAuthService({ oauthClient: null, jwtSecret: 's3' });
    expect(catchError(() => closed.token(undefined, creds))).toMatchObject({ status: 401 });
  });
});

describe('matcher toBeJwt', () => {
  it('reconhece formatos inválidos', () => {
    expect('abc').not.toBeJwt();
    expect(null).not.toBeJwt();
  });
});
