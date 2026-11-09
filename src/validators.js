const { HttpError } = require('./errors');

const bad = (msg) => new HttpError(400, msg);

function str(body, field) {
  if (typeof body[field] !== 'string' || !body[field].trim()) {
    throw bad(`Campo "${field}" é obrigatório`);
  }
}

function positiveNumber(body, field) {
  if (typeof body[field] !== 'number' || !(body[field] > 0)) {
    throw bad(`Campo "${field}" deve ser um número maior que zero`);
  }
}

function nonNegativeInt(body, field) {
  if (!Number.isInteger(body[field]) || body[field] < 0) {
    throw bad(`Campo "${field}" deve ser um inteiro maior ou igual a zero`);
  }
}

function positiveInt(body, field) {
  if (!Number.isInteger(body[field]) || body[field] <= 0) {
    throw bad(`Campo "${field}" deve ser um inteiro maior que zero`);
  }
}

module.exports = { str, positiveNumber, nonNegativeInt, positiveInt };
