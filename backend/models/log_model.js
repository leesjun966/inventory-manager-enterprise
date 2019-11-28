// This is the model for storing item logs
const Sequelize = require("sequelize");
const db = require("../utils/database");

/**
 * ID                 : Unique ID for the entry (Auto Generated)
 * Material_ID        : Unique ID for the product
 * Batch_ID           : Unique ID for the product batch
 * Quantity           : Total number of units in the batch
 * Action             : Specific type of action
 * Previous_Batch_ID  : Previous ID for item
 * Employee           : Unique ID of the employee who perform the action
 * Supplier           : Unique ID of the supplier who supply it
 */
const log = db.define(
  "Log",
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
      allowNull: false
    },
    Action: {
      type: Sequelize.STRING,
      allowNull: false
    },
    Previous_Batch_ID: {
      type: Sequelize.STRING,
      allowNull: true
    },
    Employee: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    Supplier: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    updatedAt: false,
    createdAt: "Date_Time"
  }
);

module.exports = log;
