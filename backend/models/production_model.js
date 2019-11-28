// This is the model for production table
const Sequelize = require("sequelize");
const db = require("../utils/database");

// import associated models
const inventory = require("./inventory_model");
const warehouse = require("./warehouse_model");
const employee = require("./user_model");

/**
 * ID              : Unique ID for the entry (Auto Generated)
 * Material_ID     : Unique ID for the product
 * Batch_ID        : Unique ID for the product batch
 * Quantity        : Total number of units in the batch
 * Location        : Storage location
 * Employee        : Unique ID of the qmployee who took it from warehouse
 */
const production = db.define(
  "Production",
  {
    ID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    Material_ID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    Batch_ID: {
      type: Sequelize.STRING,
      allowNull: false
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
    Employee: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    updatedAt: false,
    createdAt: "Date_Taken"
  }
);

// define associations and foreign keys with Inventory
inventory.hasMany(production, {
  foreignKey: "Material_ID",
  targetKey: "ID",
  onDelete: "NO ACTION"
});
production.belongsTo(inventory, {
  foreignKey: "Material_ID",
  targetKey: "ID",
  onDelete: "NO ACTION"
});
// define associations and foreign keys with Employee
production.belongsTo(employee, {
  foreignKey: "Employee",
  targetKey: "ID",
  onDelete: "NO ACTION"
});

module.exports = production;
