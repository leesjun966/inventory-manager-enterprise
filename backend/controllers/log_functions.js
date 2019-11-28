// This file contain function for action logging
const log = require("../models/log_model");
const util = require("../utils/utilities");

const sqllog = false;

/**
 * Add to log
 * @param {Transaction} t     SQL Transaction
 * @param {String} mat_id     Material ID code
 * @param {String} batch_id   Material Batch
 * @param {Int} quantity      Quantity transferred
 * @param {String} action     Action performed
 * @param {Int} employee      Employee responsible  (Optional)
 * @param {Int} supplier      Supply by (Optional)
 */
const log_action = async (
  t,
  mat_id,
  batch_id,
  quantity,
  action,
  employee = null,
  supplier = null
) => {
  try {
    await log.create(
      {
        Material_ID: mat_id,
        Batch_ID: batch_id,
        Quantity: quantity,
        Action: action,
        Employee: employee,
        Supplier: supplier
      },
      { transaction: t, logging: sqllog }
    );
    return;
  } catch (err) {
    throw { name: "LoggingError" };
  }
};

/**
 * Track item history
 * @param {String} batch    Unique Batch ID
 */
const track_item = async batch => {
  // get logs for item
  var data = await log.findAll({
    where: {
      Batch_ID: batch
    },
    raw: true,
    logging: sqllog
  });
  var prev_batch = [];
  // get all previous batch
  for (var i = 0; i < data.length; i++) {
    cur = data[0].Previous_Batch_ID;
    if (cur !== null) {
      prev_batch = prev_batch.concat(cur.split(";"));
    }
  }
  // get logs for previous batch
  var prev = await log.findAll({
    where: {
      Batch_ID: prev_batch
    },
    raw: true,
    logging: sqllog
  });
  // concat all
  var final_data = data.concat(prev);
  final_data = util.sortByKey(final_data, "ID");
  return final_data;
};

module.exports = { log_action: log_action, track_item: track_item };
