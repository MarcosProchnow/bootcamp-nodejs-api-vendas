// Módulo 4 - extensão dos matchers do Jest.
expect.extend({
  // Verifica o formato de um JWT: três segmentos base64url separados por ponto.
  toBeJwt(received) {
    const pass = typeof received === 'string' && /^[\w-]+\.[\w-]+\.[\w-]+$/.test(received);
    return {
      pass,
      message: () => `esperava ${pass ? 'que NÃO fosse' : 'um'} JWT, recebi ${String(received)}`,
    };
  },
});
