const crypto = require("crypto");

// hash a string with shha256 and return the hex value
const hash = password => {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
};

// authenticate user passowrd
const user_auth = (password, salt, saltedhash) => {
  var cur_hash = hash(salt + password);

  if (cur_hash === saltedhash) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  hash: hash,
  user_auth: user_auth
};
