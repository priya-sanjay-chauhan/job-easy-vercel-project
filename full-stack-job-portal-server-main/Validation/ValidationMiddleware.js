const { validationResult } = require("express-validator");
const createError = require("http-errors");

exports.inputValidationMiddleware = (req, res, next) => {
  console.log("=== Validation Middleware ===");
  console.log("Request body:", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({
      status: false,
      message: "Validation failed",
      error: errors.array(),
    });
  }

  console.log("Validation passed");
  next();
};
