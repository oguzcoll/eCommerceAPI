const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) => {
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return false;
    }
    return true;
  });
};
module.exports = { createJWT, isTokenValid };
