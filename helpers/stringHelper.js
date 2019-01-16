const crypto = require('crypto');

function getUniqueString(length = 8) {
  return crypto.randomBytes(length).toString("hex");
}

module.exports = {
  getUniqueString
};
