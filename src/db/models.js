const { DataTypes } = require('sequelize');

// Módulo 3 - mapeamento ORM (Sequelize) das entidades do domínio.
function defineModels(sequelize) {
  const opts = { timestamps: false };

  const Client = sequelize.define(
    'Client',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      phone: DataTypes.STRING,
    },
    { ...opts, tableName: 'clients' },
  );

  const Supplier = sequelize.define(
    'Supplier',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      cnpj: { type: DataTypes.STRING, allowNull: false },
      phone: DataTypes.STRING,
    },
    { ...opts, tableName: 'suppliers' },
  );

  const Product = sequelize.define(
    'Product',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.DOUBLE, allowNull: false },
      stock: { type: DataTypes.INTEGER, allowNull: false },
      supplierId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { ...opts, tableName: 'products' },
  );

  const Sale = sequelize.define(
    'Sale',
    {
      clientId: { type: DataTypes.INTEGER, allowNull: false },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      total: { type: DataTypes.DOUBLE, allowNull: false },
    },
    { ...opts, tableName: 'sales' },
  );

  const User = sequelize.define(
    'User',
    {
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
    },
    { ...opts, tableName: 'users' },
  );

  // Associações (a integridade é validada nos services, por isso sem FK física)
  Supplier.hasMany(Product, { foreignKey: 'supplierId', constraints: false });
  Product.belongsTo(Supplier, { foreignKey: 'supplierId', constraints: false });
  Client.hasMany(Sale, { foreignKey: 'clientId', constraints: false });
  Product.hasMany(Sale, { foreignKey: 'productId', constraints: false });

  return { Client, Supplier, Product, Sale, User };
}

module.exports = { defineModels };
