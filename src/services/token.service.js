const jwt = require("jsonwebtoken");

exports.generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1m" }); // 123 is secret key used in env later
};

exports.generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });
};
