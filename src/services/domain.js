const { HttpError } = require('../errors');
const { createCrudService } = require('./crudService');
const v = require('../validators');

function createClientsService(repo) {
  return createCrudService(repo, {
    resourceName: 'Cliente',
    fields: ['name', 'email', 'phone'],
    validate(b) {
      v.str(b, 'name');
      v.str(b, 'email');
      if (!/^\S+@\S+\.\S+$/.test(b.email)) throw new HttpError(400, 'E-mail inválido');
    },
  });
}

function createSuppliersService(repo) {
  return createCrudService(repo, {
    resourceName: 'Fornecedor',
    fields: ['name', 'cnpj', 'phone'],
    validate(b) {
      v.str(b, 'name');
      v.str(b, 'cnpj');
    },
  });
}

function createProductsService(repo, suppliersService) {
  return createCrudService(repo, {
    resourceName: 'Produto',
    fields: ['name', 'price', 'stock', 'supplierId'],
    async validate(b) {
      v.str(b, 'name');
      v.positiveNumber(b, 'price');
      v.nonNegativeInt(b, 'stock');
      v.positiveInt(b, 'supplierId');
      await suppliersService.get(b.supplierId); // 404 se o fornecedor não existe
    },
  });
}

// Vendas: valida estoque ao vender e devolve o estoque ao excluir a venda.
function createSalesService(repo, clientsService, productsService, productsRepo) {
  const base = createCrudService(repo, {
    resourceName: 'Venda',
    fields: ['clientId', 'productId', 'quantity'],
    validate(b) {
      v.positiveInt(b, 'clientId');
      v.positiveInt(b, 'productId');
      v.positiveInt(b, 'quantity');
    },
  });

  return {
    list: base.list,
    get: base.get,

    async create(body) {
      v.positiveInt(body, 'clientId');
      v.positiveInt(body, 'productId');
      v.positiveInt(body, 'quantity');
      await clientsService.get(body.clientId);
      const product = await productsService.get(body.productId);
      if (product.stock < body.quantity) {
        throw new HttpError(409, 'Estoque insuficiente');
      }
      await productsRepo.update(product.id, { stock: product.stock - body.quantity });
      return repo.create({
        clientId: body.clientId,
        productId: body.productId,
        quantity: body.quantity,
        // arredonda para centavos: 0.1 * 3 === 0.30000000000000004 em ponto flutuante
        total: Math.round(product.price * body.quantity * 100) / 100,
      });
    },

    async remove(id) {
      const sale = await base.get(id);
      const product = await productsRepo.get(sale.productId);
      if (product) {
        await productsRepo.update(product.id, { stock: product.stock + sale.quantity });
      }
      await repo.remove(sale.id);
    },
  };
}

module.exports = {
  createClientsService,
  createSuppliersService,
  createProductsService,
  createSalesService,
};
