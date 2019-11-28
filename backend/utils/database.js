const Sequelize = require("sequelize");

// hosting ip address
const db_host = "0.0.0.0";
const username = "root";
const password = "baby1234";

// Connect to inventory database
const database = new Sequelize("Inventory", username, password, {
  dialect: "mysql",
  host: db_host,
  timezone: "+08:00"
});

module.exports = database;
