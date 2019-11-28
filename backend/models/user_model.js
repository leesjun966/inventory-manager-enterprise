// This model enable Adding, Removing, and Authenticating Users
const Sequelize = require("sequelize");
const db = require("../utils/database");

/**
 * ID              : Unique ID for the entry (Auto Generated)
 * Username        : Unique Username
 * Family_Name     : Unique ID for the proeuct batch
 * Given_Name      : Unique ID for the proeuct batch
 * Position        : Total number of units in the batch
 * Admin_Level     : The admin access level of employee
 * Salt            : The random salt of for password
 * Hash            : The salted hash
 * QR_Code         : Assigned QR Code
 *  */
const users = db.define(
  "UserList",
  {
    ID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    Username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    Family_Name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    Given_Name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    Position: {
      type: Sequelize.STRING,
      allowNull: false
    },
    Admin_Level: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 10 }
    },
    Salt: {
      type: Sequelize.STRING,
      allowNull: false
    },
    Hash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    QR_Code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    EMP_NO: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = users;
