// This is the model for main material table (InventoryList)
const Sequelize = require("sequelize");
const db = require("../utils/database");

/**
 * ID                     : Unique ID for the item
 * Description            : Name or description for the item
 */
const inventoryList = db.define(
  "InventoryList",
  {
    ID: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    Description: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = inventoryList;
