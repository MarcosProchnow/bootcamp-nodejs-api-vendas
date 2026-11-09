const { buildSchema } = require('graphql');
const { createHandler } = require('graphql-http/lib/use/express');

// Módulo 1 - GraphQL: schema (SDL) + resolvers que reutilizam os mesmos services da API REST.
const schema = buildSchema(`
  type Client { id: ID! name: String! email: String! phone: String }
  type Supplier { id: ID! name: String! cnpj: String! phone: String }
  type Product {
    id: ID! name: String! price: Float! stock: Int! supplierId: Int!
    supplier: Supplier
  }
  type Sale { id: ID! clientId: Int! productId: Int! quantity: Int! total: Float! }

  type Query {
    clients: [Client!]!
    client(id: ID!): Client
    suppliers: [Supplier!]!
    products(supplierId: Int): [Product!]!
    sales: [Sale!]!
  }

  type Mutation {
    createClient(name: String!, email: String!, phone: String): Client!
  }
`);

function createGraphqlHandler({ clients, suppliers, products, sales }) {
  const root = {
    clients: () => clients.list({}),
    client: ({ id }) => clients.get(id),
    suppliers: () => suppliers.list({}),
    products: async ({ supplierId }) => {
      const list = await products.list(supplierId ? { supplierId } : {});
      return list.map((p) => ({ ...p, supplier: () => suppliers.get(p.supplierId) }));
    },
    sales: () => sales.list({}),
    createClient: (args) => clients.create(args),
  };
  return createHandler({ schema, rootValue: root });
}

module.exports = { createGraphqlHandler };
