// This is the model for storing suppliers
const Sequelize = require("sequelize");
const db = require("../utils/database");

/**
 * ID      : Unique ID for the supplier
 * Name    : Company Name
 */
const supplier = db.define(
  "Supplier",
  {
    ID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = supplier;
