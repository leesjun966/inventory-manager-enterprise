// This is the model for warehouse table
const Sequelize = require("sequelize");
const db = require("../utils/database");

// import associated models
const inventory = require("./inventory_model");
const employee = require("./user_model");
const supplier = require("./supplier_model");

/**
 * Material_ID     : Unique ID for the item
 * Batch_ID        : Unique ID for the item batch
 * Quantity        : Total number of units in the batch
 * Location        : Storage location
 * Register_By     : Unique ID of the employee who register it
 * Supplier        : Unique ID of the supplier who supply it
 */
const warehouse = db.define(
  "Warehouse",
  {
    ID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    Material_ID: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: false
    },
    Batch_ID: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: false
    },
    Quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { min: 0 }
    },
    Location: {
      type: Sequelize.STRING,
      allowNull: true
    },
    Register_By: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    Supply_By: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    updatedAt: false,
    createdAt: "Date_In"
  }
);

inventory.hasMany(warehouse, {
  foreignKey: "Material_ID",
  targetKey: "ID",
  onDelete: "NO ACTION"
});

// define associations and foreign keys with Inventory
warehouse.belongsTo(inventory, {
  foreignKey: "Material_ID",
  targetKey: "ID",
  onDelete: "NO ACTION"
});
// define associations and foreign keys with Employee
warehouse.belongsTo(employee, {
  foreignKey: "Register_By",
  targetKey: "ID",
  onDelete: "NO ACTION"
});
// define associations and foreign keys with Supplier
warehouse.belongsTo(supplier, {
  foreignKey: "Supply_By",
  targetKey: "ID",
  onDelete: "NO ACTION"
});

module.exports = warehouse;
