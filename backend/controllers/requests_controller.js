const Sequelize = require("sequelize");

const db = require("../utils/database");
const requestFunctions = require("./request_functions");
const handleError = require("../utils/error_response").handleError;

// send whole request list
exports.sendRequests = async (req, res) => {
  try {
    const data = await requestFunctions.send_requests();
    res.status(200).send(JSON.stringify(data));
  } catch (err) {
    handleError(err);
  }
};

// send pending request
exports.sendPending = async (req, res) => {
  try {
    const data = await requestFunctions.send_pending();
    res.status(200).send(JSON.stringify(data));
  } catch (err) {
    handleError(err);
  }
};

// create new request
exports.createRequest = async (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  const action = obj.action;
  const qr = obj.qrcode;
  const quantity = obj.quantity;
  const employee = obj.employee_id;
  const supplier = obj.supplier_id;
  const t = await db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  });

  try {
    await requestFunctions.create_request(
      t,
      action,
      qr,
      quantity,
      employee,
      supplier
    );
    await t.commit();
    res.status(201).send(JSON.stringify({ Status: "Success" }));
  } catch (err) {
    await t.rollback();
    handleError(err, res);
  }
};

// update request status
// "Approved", "Rejected", "Executed", "Pending"
exports.updateStatus = async (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  const req_id = obj.req_id;
  const new_stat = obj.status;
  const t = await db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  });

  try {
    await requestFunctions.update_status(t, req_id, new_stat);
    await t.commit();
    res.status(201).send(JSON.stringify({ Status: "Success" }));
  } catch (err) {
    await t.rollback();
    handleError(err, res);
  }
};

// Executed all approved requests
exports.executeRequests = async (req, res) => {
  try {
    const data = await requestFunctions.execute_requests();
    res.status(200).send(JSON.stringify(data));
  } catch (err) {
    handleError(err);
  }
};
