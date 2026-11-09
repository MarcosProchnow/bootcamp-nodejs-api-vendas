const { createApp } = require('./app');
const config = require('./config');

createApp().listen(config.port, () => {
  console.log(`API de vendas rodando na porta ${config.port}`);
});
