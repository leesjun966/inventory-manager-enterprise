// This file contain functions for CRUD API
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const inventory = require("../models/inventory_model");
const warehouse = require("../models/warehouse_model");
const production = require("../models/production_model");
const logAction = require("./log_functions").log_action;
const util = require("../utils/utilities");

const sqllog = false;

/**
 * Create a new material/item category
 * @param {String}      description   Name of item
 * @param {Transaction} t             SQL Transaction
 */
const create_category = async (t, description) => {
  // generate unique material ID for this item category
  const id = await util.generateID(t);
  // insert new database entry
  await inventory.create(
    {
      ID: id,
      Description: description
    },
    { transaction: t, logging: sqllog }
  );
  return;
};

/**
 * Edit an inventory item detail
 * @param {String}      table     Source table
 * @param {JSON}        newVal    Updated values
 * @param {Transaction} t         SQL Transaction
 */
const edit_item = async (t, table, id, newVal) => {
  const tables = {
    Inventory: inventory,
    Warehouse: warehouse,
    Production: production
  };
  // update table
  await tables[table].update(newVal, {
    where: { ID: id },
    transaction: t,
    logging: sqllog
  });
  return;
};

/**
 * Insert item into warehouse
 * @param {String}      qr            Material ID code
 * @param {Int}         quantity      Quantity to be inserted
 * @param {Int}         employee      Employee responsible
 * @param {Int}         supplier      Supplier
 * @param {Transaction} t             SQL Transaction
 */
const insert_item = async (t, qr, quantity, employee, supplier) => {
  // generate a unique batch ID
  const batch_id = await util.generateBatch(qr, t);
  // insert new database entry
  await warehouse.create(
    {
      Material_ID: qr,
      Batch_ID: batch_id,
      Quantity: quantity,
      Register_By: employee,
      Supply_By: supplier
    },
    { transaction: t, logging: sqllog }
  );
  await logAction(t, qr, batch_id, quantity, "Insert Item", employee, supplier);
  return;
};

/**
 * Transfer item from warehouse to production
 * @param {String}      qr            Material ID code
 * @param {Int}         quantity      Quantity to be inserted
 * @param {Int}         employee      Employee responsible
 * @param {Transaction} t             SQL Transaction
 */
const to_production = async (t, qr, quantity, employee) => {
  // get warehouse data for the specific material
  const warehouseData = await warehouse.findAll({
    where: { Material_ID: qr, Quantity: { [Op.gt]: 0 } },
    order: [["Date_In"]],
    raw: true,
    transaction: t,
    logging: sqllog
  });
  // loop through the warehouse and deduct the quantity by batch
  // create new entry in production for each batch deducted
  var count = quantity;
  var i = 0;
  while (i < warehouseData.length && count > 0) {
    var primaryKey = warehouseData[i].ID;
    var batch_id = warehouseData[i].Batch_ID;
    var batchQuantity = warehouseData[i].Quantity;
    // deduct from batch depends on how much there is
    var amount;
    if (batchQuantity >= count) {
      amount = count;
    } else if (batchQuantity < count) {
      amount = batchQuantity;
    }
    // remove from current batch
    await warehouse.update(
      { Quantity: batchQuantity - amount },
      {
        where: { ID: primaryKey },
        transaction: t,
        logging: sqllog
      }
    );
    // add to production
    await production.create(
      {
        Material_ID: qr,
        Batch_ID: batch_id,
        Quantity: amount,
        Employee: employee
      },
      { transaction: t, logging: sqllog }
    );
    await logAction(t, qr, batch_id, amount, "Move to Production", employee);
    count -= amount;
    i++;
  }
  return count;
};

/**
 * Transfer item from warehouse to customer
 * @param {String}      qr            Material ID code
 * @param {Int}         quantity      Quantity to be inserted
 * @param {Transaction} t             SQL Transaction
 */
const to_external = async (t, qr, quantity) => {
  // get warehouse data for the specific material
  const warehouseData = await warehouse.findAll({
    where: { Material_ID: qr, Quantity: { [Op.gt]: 0 } },
    order: [["Date_In"]],
    raw: true,
    transaction: t,
    logging: sqllog
  });
  // loop through the warehouse and deduct the quantity by batch
  var count = quantity;
  var i = 0;
  while (i < warehouseData.length && count > 0) {
    var primaryKey = warehouseData[i].ID;
    var batch_id = warehouseData[i].Batch_ID;
    var batchQuantity = warehouseData[i].Quantity;
    // deduct from batch depends on how much there is
    var amount;
    if (batchQuantity >= count) {
      amount = count;
    } else if (batchQuantity < count) {
      amount = batchQuantity;
    }
    // remove from current batch
    await warehouse.update(
      { Quantity: batchQuantity - amount },
      {
        where: { ID: primaryKey },
        transaction: t,
        logging: sqllog
      }
    );
    await logAction(t, qr, batch_id, amount, "Move to External");
    count -= amount;
    i++;
  }
};

/**
 * Transfer item from production to warehouse
 * Transfer item from warehouse to production
 * @param {String}      qr            Material ID code
 * @param {Int}         quantity      Quantity to be inserted
 * @param {Int}         employee      Employee responsible
 * @param {Transaction} t             SQL Transaction
 */
const to_warehouse = async (t, qr, quantity, employee) => {
  // get warehouse data for the specific material
  const productionData = await production.findAll({
    where: { Material_ID: qr, Employee: employee, Quantity: { [Op.gt]: 0 } },
    order: [["Date_Taken"]],
    raw: true,
    transaction: t,
    logging: sqllog
  });
  // loop through the warehouse and deduct the quantity by batch
  // create new entry in production for each batch deducted
  var count = quantity;
  var i = 0;
  while (i < productionData.length && count > 0) {
    var primaryKey = productionData[i].ID;
    var batch_id = productionData[i].Batch_ID;
    var batchQuantity = productionData[i].Quantity;
    // deduct from batch depends on how much there is
    var amount;
    if (batchQuantity >= count) {
      amount = count;
    } else if (batchQuantity < count) {
      amount = batchQuantity;
    }
    // remove from current batch
    await production.update(
      { Quantity: batchQuantity - amount },
      {
        where: { ID: primaryKey },
        transaction: t,
        logging: sqllog
      }
    );
    // see if warehouse contain this entry, if not create it
    var new_batch = await util.generateBatch(qr);
    var result = await warehouse.findOrCreate({
      where: { Material_ID: qr, Batch_ID: batch_id },
      defaults: {
        Material_ID: qr,
        Batch_ID: new_batch,
        Quantity: amount,
        Register_By: employee
      },
      raw: false,
      transaction: t,
      logging: sqllog
    });
    // update entry if exist
    if (!result[1]) {
      await warehouse.increment("Quantity", {
        by: amount,
        where: { Material_ID: qr, Batch_ID: batch_id },
        transaction: t,
        logging: sqllog
      });
    }
    await logAction(t, qr, batch_id, amount, "Move to Warehouse", employee);
    count -= amount;
    i++;
  }
};

module.exports = {
  create_category: create_category,
  edit_item: edit_item,
  insert_item: insert_item,
  to_production: to_production,
  to_external: to_external,
  to_warehouse: to_warehouse
};
