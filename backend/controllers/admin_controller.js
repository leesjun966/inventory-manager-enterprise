// This controller contains functions for admin to work on Users within the system
const user = require("../models/user_model");
const auth = require("../utils/authentication");
const util = require("../utils/utilities");

// Information that is not allowed at the front end
const hiddenFields = ["Salt", "Hash", "QR_Code"];

// Send the list of user and their informatioon
// user salt and salted hash is not sent
exports.sendUsers = (req, res) => {
  // To filter out salt and hash

  user
    .findAll({
      attributes: { exclude: hiddenFields },
      raw: true,
      logging: false
    })
    .then(data => {
      // get keys and filter out hidden ones
      var keys = Object.keys(user.rawAttributes);
      keys = util.filterArray(keys, hiddenFields);
      // generate the labels for frontend display
      var labels = [];
      keys.forEach(key => (labels = labels.concat([key.replace("_", " ")])));

      res.send(JSON.stringify({ keys: keys, labels: labels, results: data }));
    })
    .catch(err => res.send(JSON.stringify({ Status: err.message })));
};

// get a specific user by primary key
exports.sendUser = (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);
  const id = obj.usr_id;

  user
    .findByPk(id, {
      attributes: { exclude: hiddenFields },
      raw: true,
      logging: false
    })
    .then(data => {
      // get keys and filter out hidden ones
      var keys = Object.keys(user.rawAttributes);
      keys = util.filterArray(keys, hiddenFields);
      // generate the labels for frontend display
      var labels = [];
      keys.forEach(key => (labels = labels.concat([key.replace("_", " ")])));

      res.send(JSON.stringify({ keys: keys, labels: labels, results: data }));
    })
    .catch(err => res.send(JSON.stringify({ Status: err.message })));
};

// Add user into the system
exports.addUser = (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  var password = obj.password;
  var salt = util.random_string(10);
  var hash = auth.hash(salt + password);
  var qr = util.random_string(255);

  user
    .create(
      {
        Username: obj.username,
        Family_Name: obj.fam_name,
        Given_Name: obj.giv_name,
        Position: obj.position,
        Admin_Level: obj.admin_level,
        Salt: salt,
        Hash: hash,
        QR_Code: qr,
        EMP_NO: obj.emp_no
      },
      { logging: false }
    )
    .then(result => res.send(JSON.stringify({ Status: "New User Added" })))
    .catch(err => res.send(JSON.stringify({ Status: err.message })));
};

// Remove user from the system
exports.removeUsers = (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  var id = obj.usr_id;

  user
    .destroy({ where: { ID: id }, logging: false })
    .then(result => {
      if (result == 1) {
        res.send(JSON.stringify({ Status: "User Removed" }));
      } else {
        res.send(JSON.stringify({ Status: "User Does Not Exist" }));
      }
    })
    .catch(err => res.send(JSON.stringify({ Status: err.message })));
};

// update user values
exports.editUser = (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);
  const id = obj.usr_id;

  const new_Val = {
    Family_Name: obj.newVal.fam_name,
    Given_Name: obj.newVal.giv_name,
    Position: obj.newVal.position,
    Admin_Level: obj.newVal.admin_level
  };

  user
    .update(new_Val, { where: { ID: id }, logging: false })
    .then(result => res.send(JSON.stringify({ Status: "Success" })))
    .catch(err => res.send(JSON.stringify({ Status: err.message })));
};

// generate a user QR Code
exports.generateQR = async (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  var id = obj.usr_id;

  try {
    const result = await user.findByPk(id, {
      attributes: ["QR_Code"],
      raw: true,
      logging: false
    });

    if (result === null) {
      res.status(200).send(JSON.stringify({ Status: "User Does Not Exist" }));
    } else {
      const data_url = await util.generate_qr(result.QR_Code);
      res.status(200).send(JSON.stringify({ qrcode: data_url }));
    }
  } catch (err) {
    res.status(500).send(JSON.stringify({ Status: err.message }));
  }
};

// reset employee QR code
exports.resetQR = (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]);

  var id = obj.usr_id;

  user
    .update(
      { QR_Code: util.random_string(255) },
      { where: { ID: id }, logging: false }
    )
    .then(result => res.send(JSON.stringify({ Status: "Success" })))
    .catch(err => res.send(JSON.stringify({ Status: err.message })));
};
