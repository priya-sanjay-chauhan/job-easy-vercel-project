const jwt = require("jsonwebtoken");

function JWTGenerator(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
    algorithm: "HS256",
  });

  return token;
}

module.exports = JWTGenerator;
