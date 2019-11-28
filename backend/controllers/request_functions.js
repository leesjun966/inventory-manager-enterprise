const Sequelize = require("sequelize");

const db = require("../utils/database");
const crudFunctions = require("./crud_functions");

const requests = require("../models/requests_model");

// true: log sql command in console
// false: no not log sql command
const sqllog = false;

// keyword and corresponding function
const crudFunctionTable = {
  insertItem: crudFunctions.insert_item,
  toProduction: crudFunctions.to_production,
  toWarehouse: crudFunctions.to_warehouse,
  toExternal: crudFunctions.to_external
};

/**
 * Passing parameter to given function
 * @param {Function} fn         Function
 * @param {Transaction} trans   Transaction
 * @param {String} id           Material ID
 * @param {Int} quantity        Amount to be transferred
 * @param {Int} employee        Employee responsible
 * @param {Int} supplier        Supply By
 */
const execute_function = async (
  fn,
  trans,
  id,
  quantity,
  employee,
  supplier
) => {
  await fn(trans, id, quantity, employee, supplier);
  return;
};

// send whole request list
const send_requests = async () => {
  const request_list = await requests.findAll({
    raw: true,
    logging: sqllog
  });
  var keys = Object.keys(requests.rawAttributes);
  // generate the labels for frontend display
  var labels = [];
  keys.forEach(key => (labels = labels.concat([key.replace("_", " ")])));

  return { keys: keys, labels: labels, results: request_list };
};

// send pending request
const send_pending = async () => {
  const request_list = await requests.findAll({
    raw: true,
    where: { Status: "Pending" },
    logging: sqllog
  });
  var keys = Object.keys(requests.rawAttributes);
  // generate the labels for frontend display
  var labels = [];
  keys.forEach(key => (labels = labels.concat([key.replace("_", " ")])));

  return { keys: keys, labels: labels, results: request_list };
};

/**
 * Create new request
 * @param {Transaction} t     Transaction
 * @param {String} action     "insertItem", "toWarehouse", "toProduction", "toExternal"
 * @param {String} id         Material ID
 * @param {Int} quantity      Amount to be transferred
 * @param {Int} employee      Employee responsible
 * @param {Int} supplier      Supply By
 */
const create_request = async (t, action, id, quantity, employee, supplier) => {
  await requests.create(
    {
      Action: action,
      Material_ID: id,
      Quantity: quantity,
      Employee: employee,
      Supplier: supplier
    },
    { transaction: t, logging: sqllog }
  );
  return;
};

/**
 * Update request status
 * @param {Transaction} t           Transaction
 * @param {Int}         req_id      Row ID
 * @param {String}      new_status  "Approved", "Rejected", "Executed", "Pending"
 */
const update_status = async (t, req_id, new_status) => {
  await requests.update(
    { Status: new_status },
    { where: { ID: req_id }, transaction: t, logging: sqllog }
  );
  return;
};

// Execute all approved request
const execute_requests = async () => {
  var statusList = [];

  const request_list = await requests.findAll({
    raw: true,
    where: { Status: "Approved" },
    logging: sqllog
  });

  for (var i = 0; i < request_list.length; i++) {
    var cur_req = request_list[i];

    var id = cur_req.ID;
    var action = cur_req.Action;
    var mat_id = cur_req.Material_ID;
    var quantity = cur_req.Quantity;
    var employee = cur_req.Employee;
    var supplier = cur_req.Supplier;

    const t = await db.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });

    try {
      await execute_function(
        crudFunctionTable[action],
        t,
        mat_id,
        quantity,
        employee,
        supplier
      );
      await update_status(t, cur_req.ID, "Executed");
      await t.commit();
      statusList = statusList.concat([{ Status: `Request ${id} Success` }]);
    } catch (error) {
      await update_status(t, cur_req.ID, "Execution Fail");
      await t.rollback();
      statusList = statusList.concat([
        { Status: `Request ${id} fail with error ${error.message}` }
      ]);
    }
  }
  return statusList;
};

module.exports = {
  send_requests: send_requests,
  send_pending: send_pending,
  create_request: create_request,
  update_status: update_status,
  execute_requests: execute_requests
};
