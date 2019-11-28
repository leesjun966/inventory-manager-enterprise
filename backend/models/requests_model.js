// This is the model for storing suppliers
const Sequelize = require("sequelize");
const db = require("../utils/database");

/**
 * ID                 : Unique ID for the entry (Auto Generated)
 * Action             : Specific type of request
 * Material_ID        : Unique ID for the product
 * Quantity           : Total number of units in the batch
 * Location           : Storage location
 * Employee           : Unique ID of the employee who made the request
 * Supplier           : Unique ID of the supplier who supply it
 * Status             : Status of request "Approved", "Rejected", "Executed", "Pending"
 */
const requests = db.define(
  "RequestList",
  {
    ID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    Action: {
      type: Sequelize.STRING,
      allowNull: false
    },
    Material_ID: {
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
      allowNull: true
    },
    Supplier: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    Status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Pending"
    }
  },
  {
    freezeTableName: true,
    updatedAt: false,
    createdAt: "Request_DateTime"
  }
);

module.exports = requests;
