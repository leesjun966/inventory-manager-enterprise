const path = require("path");
const qrcode = require("qrcode");

// import models
const warehouse = require("../models/warehouse_model");
const inventory = require("../models/inventory_model");

// get root directory
const curPath = () => {
  return path.dirname(process.mainModule.filename);
};

// generate current date and time
const getTime = () => {
  return new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
};

// create a random string of length 'string_length'
// consist of upper case letter, lower case letter, and number
const random_string = string_length => {
  var random_string = "";
  var random_ascii;
  // ascii range for number
  const num_low = 48;
  const num_high = 57;
  // ascii range for upper case letter
  const caps_low = 65;
  const caps_high = 90;
  // ascii range for lower case letter
  const lowc_low = 97;
  const lowc_high = 122;

  for (let i = 0; i < string_length; i++) {
    // Generate random char for all three category
    var random_list = [
      Math.floor(Math.random() * (num_high - num_low) + num_low),
      Math.floor(Math.random() * (caps_high - caps_low) + caps_low),
      Math.floor(Math.random() * (lowc_high - lowc_low) + lowc_low)
    ];
    // Select a char randomly from each chategry and add to current string
    random_ascii = random_list[Math.floor(Math.random() * 3)];
    random_string += String.fromCharCode(random_ascii);
  }
  return random_string;
};

// filter out elements in excludeArr in targetArr
const filterArray = (targetArr, excludeArr) => {
  return targetArr.filter(element => !excludeArr.includes(element));
};

/**
 * Generate QR code from string
 * @param {String} code     Code to be encoded into qr format
 */
const generate_qr = async code => {
  // The options
  var opts = {
    errorCorrectionLevel: "M",
    width: 500
  };

  try {
    // Generate QR code as data url
    const url = await qrcode.toDataURL(code, opts);
    return url;
  } catch (err) {
    throw err;
  }
};

/**
 * Auto generate material ID for new material
 * should be use within transaction to be safe
 * @param {*} trans   Transaction
 */
const generateID = async (trans = null) => {
  try {
    data = await inventory.findAndCountAll({
      logging: false,
      transaction: trans
    });
    var new_num = (data.count + 1).toString();
    return "A" + "0".repeat(7 - new_num.length) + new_num;
  } catch (err) {
    throw err;
  }
};

/**
 * Auto generate batch ID for new stock
 * should be use within transaction to be safe
 * @param {*} mat_id  Material Unique ID
 * @param {*} trans   Transaction
 */
const generateBatch = async (mat_id, trans = null) => {
  try {
    const Desc = await inventory.findByPk(mat_id, {
      raw: true,
      logging: false,
      rejectOnEmpty: true,
      transaction: trans
    });
    const data = await warehouse.findAndCountAll({
      where: { Material_ID: mat_id },
      logging: false,
      transaction: trans
    });
    var new_num = (data.count + 1).toString();
    return Desc.Description + new_num;
  } catch (err) {
    throw err;
  }
};

/**
 * Sort JSON array by key
 * @param {*} array   JSON Array
 * @param {*} key     Key to sort by
 */
const sortByKey = (array, key) => {
  return array.sort(function(a, b) {
    var x = a[key];
    var y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
};

module.exports = {
  path: curPath,
  datetime: getTime,
  random_string: random_string,
  filterArray: filterArray,
  generate_qr: generate_qr,
  generateID: generateID,
  generateBatch: generateBatch,
  sortByKey: sortByKey
};
