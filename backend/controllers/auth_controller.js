// This controller contains functions to authenticate users
const jwt = require("jsonwebtoken");
const user = require("../models/user_model");
const auth = require("../utils/authentication");
const util = require("../utils/utilities");

/**
 * Authenticate user and password and send token as cookie
 * Used by web front end for authhentication
 *
 * expiresIn: expressed in seconds or a string describing a time span zeit/ms.
 *
 * A numeric value is interpreted as a seconds count.
 * If you use a string be sure you provide the time units (days, hours, etc),
 * otherwise milliseconds unit is used by default ("120" is equal to "120ms").
 * Eg: 60, "2 days", "10h", "7d".
 *
 * more info on the format: https://github.com/zeit/ms
 */
exports.authenticate_user = (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]).userData;
  const username = obj.username;
  const password = obj.password;
  const secret = "thisisttestsecret";

  user
    .findAll({
      attributes: ["Salt", "Hash", "Admin_Level", "ID"],
      where: {
        Username: username
      },
      // only return data
      raw: true,
      logging: false
    })
    .then(data => {
      if (data.length === 0) {
        res.status(401).json({
          error: "User Does Not Exist"
        });
      } else {
        var salt = data[0].Salt;
        var hash = data[0].Hash;
        var adm_level = data[0].Admin_Level;
        var id = data[0].ID;

        if (!auth.user_auth(password, salt, hash)) {
          // wrong password given
          res.status(401).json({
            error: "Incorrect Password"
          });
        } else {
          // issue token
          const payload = { username, adm_level, id };
          const token = jwt.sign(payload, secret, {
            expiresIn: "2h"
          });
          res.status(200).send(token);
        }
      }
    })
    .catch(err => res.status(401).json({ error: err.message }));
};

/**
 * Check a association between QR code and user
 * Send a token, and user information as resposne
 * Used by app for authentication
 *
 * expiresIn: expressed in seconds or a string describing a time span zeit/ms.
 *
 * A numeric value is interpreted as a seconds count.
 * If you use a string be sure you provide the time units (days, hours, etc),
 * otherwise milliseconds unit is used by default ("120" is equal to "120ms").
 * Eg: 60, "2 days", "10h", "7d".
 *
 * more info on the format: https://github.com/zeit/ms
 */
exports.authenticate_qr = (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]).userData;
  const decoded_qr = obj.qrcode;
  const secret = "thisisttestsecret";

  user
    .findAll({
      attributes: [
        "ID",
        "Username",
        "Family_Name",
        "Given_Name",
        "Admin_Level"
      ],
      where: {
        QR_Code: decoded_qr
      },
      // Only return data
      raw: true,
      logging: false
    })
    .then(data => {
      if (data.length === 0) {
        res.status(401).json({
          error: "User Does Not Exist"
        });
      } else {
        username = data[0].Username;
        // issue token and data
        const payload = { username };
        const token = jwt.sign(payload, secret, {
          expiresIn: "1h"
        });
        res.status(200).json({
          token: token,
          username: username,
          fullname: data[0].Given_Name + " " + data[0].Family_Name,
          admin_level: data[0].Admin_Level,
          id: data[0].ID
        });
      }
    })
    .catch(err => res.status(401).json({ error: err.message }));
};

// check user existing password and change to new password
exports.changePassword = (req, res) => {
  const obj = JSON.parse(Object.keys(req.body)[0]).userData;
  const username = obj.username;
  const o_pw = obj.old_pw;
  const n_pw = obj.new_pw;

  user
    .findAll({
      attributes: ["Salt", "Hash", "Admin_Level"],
      where: {
        Username: username
      },
      // only return data
      raw: true,
      logging: false
    })
    .then(data => {
      var salt = data[0].Salt;
      var hash = data[0].Hash;

      if (!auth.user_auth(o_pw, salt, hash)) {
        // wrong password given
        res.send({ Status: "Incorrect Password" });
      } else {
        var new_salt = util.random_string(10);
        var new_hash = auth.hash(salt + n_pw);
        // update salt and hash for new password
        user
          .update(
            { Salt: new_salt, Hash: new_hash },
            { where: { Username: username }, logging: false }
          )
          .then(result => res.send(JSON.stringify({ Status: "Success" })))
          .catch(err => res.send(JSON.stringify({ Status: err.message })));
      }
    });
};
