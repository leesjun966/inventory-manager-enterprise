// This controller contains function that perform CRUD operations for Inventory Database
const Sequelize = require("sequelize");

const db = require("../utils/database");
const crudFunctions = require("./crud_functions");
const logFunctions = require("./log_functions");
const util = require("../utils/utilities");
const handleError = require("../utils/error_response").handleError;

const inventory = require("../models/inventory_model");
const warehouse = require("../models/warehouse_model");
const supplier = require("../models/supplier_model");
const production = require("../models/production_model");
const log = require("../models/log_model");
const requests = require("../models/requests_model");

// true: log sql command in console
// false: no not log sql command
const sqllog = false;

// Send inventory information, get sum of total quantity for each material
exports.sendInventory = (req, res) => {
  inventory
    .findAll({
      attributes: [
        "ID",
        "Description",
        [
          Sequelize.fn("sum", Sequelize.col("Warehouses.Quantity")),
          "Warehouse_Quantity"
        ],
        [
          Sequelize.fn("sum", Sequelize.col("Productions.Quantity")),
          "Production_Quantity"
        ]
      ],
      include: [
        { model: warehouse, attributes: [] },
        { model: production, attributes: [] }
      ],
      group: ["ID"],
      raw: true,
      orderBy: ["ID"],
      logging: sqllog
    })
    .then(data => {
      // keys have to be defined since this is aggregated
      var keys = [
        "ID",
        "Description",
        "Warehouse_Quantity",
        "Production_Quantity"
      ];
      // generate the labels for frontend display
      var labels = [];
      keys.forEach(key => (labels = labels.concat([key.replace("_", " ")])));

      res.send({ keys: keys, labels: labels, results: data });
    })
    .catch(err => res.send({ Status: err.message }));
};

// Send a table from database as json
exports.sendTable = (req, res) => {
  // key value pair for model and table name
  const tables = {
    Warehouse: warehouse,
    Production: production,
    Supplier: supplier,
    Log: log,
    Requests: requests
  };

  const obj = JSON.parse(Object.keys(req.body)[0]);
  // name of the table in DB
  const table = obj.table;

  // get the model from provided table name
  tables[table]
    .findAll({
      raw: true,
      logging: sqllog
    })
    .then(data => {
      // get keys
      var keys = Object.keys(tables[table].rawAttributes);
      // generate the labels for frontend display
      var labels = [];
      keys.forEach(key => (labels = labels.concat([key.replace("_", " ")])));

      res.send({ keys: keys, labels: labels, results: data });
    })
    .catch(err => res.send({ Status: err.message }));
};

// Send specific material from warehouse or production
exports.sendSpecific = (req, res) => {
  // key value pair for model and table name
  const tables = {
    Warehouse: warehouse,
    Production: production
  };

  const obj = JSON.parse(Object.keys(req.body)[0]);

  // name of the table and ID for material in DB
  const table = obj.table;
  const id = obj.mat_id;

  tables[table]
    .findAll({
      where: {
        Material_ID: id
      },
      raw: true,
      logging: sqllog
    })
    .then(data => {
      // get keys
      var keys = Object.keys(tables[table].rawAttributes);
      // generate the labels for frontend display
      var labels = [];
      keys.forEach(key => (labels = labels.concat([key.replace("_", " ")])));

      res.send({ keys: keys, labels: labels, results: data });
    })
    .catch(err => res.send({ Status: err.message }));
};

// send a specific row by unique ID
exports.sendRow = (req, res) => {
  const tables = {
    Inventory: inventory,
    Warehouse: warehouse,
    Production: production,
    Supplier: supplier
  };

  const obj = JSON.parse(Object.keys(req.body)[0]);

  const table = obj.table;
  const col = obj.col_id;

  tables[table]
    .findByPk(col, { raw: true, logging: sqllog })
    .then(data => {
      // get keys
      var keys = Object.keys(tables[table].rawAttributes);
      // generate the labels for frontend display
      var labels = [];
      keys.forEach(key => (labels = labels.concat([key.replace("_", " ")])));

      res.send({ keys: keys, labels: labels, results: data });
    })
    .catch(err => res.send({ Status: err.message }));
};

// Generate material QR code
exports.generateMaterialQR = async (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  var id = obj.mat_id;

  try {
    const data_url = await util.generate_qr(id);
    res.status(200).send(JSON.stringify({ qrcode: data_url }));
  } catch (err) {
    handleError(err, res);
  }
};

// Create a new material entry
exports.createCategory = async (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  const description = obj.description;
  const t = await db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  });

  try {
    // create category
    await crudFunctions.create_category(t, description);
    // commit changes
    await t.commit();
    res.status(201).send(JSON.stringify({ Status: "Success" }));
  } catch (err) {
    // rollback changes
    await t.rollback();
    handleError(err, res);
  }
};

// Update Item values
exports.editItem = async (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  const table = obj.table;
  const newVal = obj.newVal;
  const id = obj.id;
  const t = await db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  });

  try {
    // edit item
    await crudFunctions.edit_item(t, table, id, newVal);
    // commit changes
    await t.commit();
    res.status(200).send(JSON.stringify({ Status: "Success!" }));
  } catch (err) {
    // rollback changes
    await t.rollback();
    handleError(err, res);
  }
};

// Insert a batch of material into warehouse
exports.insertItem = async (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  const qr = obj.qrcode;
  const quantity = obj.quantity;
  const employee = obj.employee_id;
  const supplier = obj.supplier_id;
  const t = await db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  });

  try {
    // insert item
    await crudFunctions.insert_item(t, qr, quantity, employee, supplier);
    // commit changes
    await t.commit();
    res.status(201).send(JSON.stringify({ Status: "Success" }));
  } catch (err) {
    // rollback changes
    await t.rollback();
    handleError(err, res);
  }
};

// Transfer material from warehouse to production
exports.toProduction = async (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  const qr = obj.qrcode;
  const quantity = obj.quantity;
  const employee = obj.employee_id;
  const t = await db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  });

  try {
    // send to production
    // count is how much is not transfered
    var count = await crudFunctions.to_production(t, qr, quantity, employee);
    if (count === 0) {
      // commit changes
      await t.commit();
      res.status(200).send(JSON.stringify({ Status: "Success" }));
    } else {
      // commit changes
      await t.commit();
      res
        .status(200)
        .send(
          JSON.stringify({ Status: `Only ${quantity - count} is transfered` })
        );
    }
  } catch (err) {
    // rollback changes
    await t.rollback();
    handleError(err, res);
  }
};

// Transfer material to customer
exports.toExternal = async (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  const qr = obj.qrcode;
  const quantity = obj.quantity;
  const t = await db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  });

  try {
    // send to external
    var count = await crudFunctions.to_external(t, qr, quantity);
    if (count === 0) {
      // commit changes
      await t.commit();
      res.status(200).send(JSON.stringify({ Status: "Success" }));
    } else {
      // commit changes
      await t.commit();
      res
        .status(200)
        .send(
          JSON.stringify({ Status: `Only ${quantity - count} is transfered` })
        );
    }
  } catch (err) {
    // rollback changes
    await t.rollback();
    handleError(err, res);
  }
};

// Transfer material from production to warehouse
exports.toWarehouse = async (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  const qr = obj.qrcode;
  const quantity = obj.quantity;
  const employee = obj.employee_id;
  const t = await db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  });

  try {
    // send to warehouse
    var count = await crudFunctions.to_warehouse(t, qr, quantity, employee);
    if (count === 0) {
      // commit changes
      await t.commit();
      res.status(200).send(JSON.stringify({ Status: "Success" }));
    } else {
      // commit changes
      await t.commit();
      res
        .status(200)
        .send(
          JSON.stringify({ Status: `Only ${quantity - count} is transfered` })
        );
    }
  } catch (err) {
    // rollback changes
    await t.rollback();
    handleError(err, res);
  }
};

exports.sendFlow = async (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  const batch_id = obj.batch;

  try {
    const data = await logFunctions.track_item(batch_id);
    // get keys
    var keys = Object.keys(log.rawAttributes);
    // generate the labels for frontend display
    var labels = [];
    keys.forEach(key => (labels = labels.concat([key.replace("_", " ")])));

    res.send({ keys: keys, labels: labels, results: data });
  } catch (err) {
    handleError(err, res);
  }
};
