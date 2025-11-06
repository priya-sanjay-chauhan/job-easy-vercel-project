const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const UserModel = require("../Model/UserModel");

exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.signedCookies[process.env.COOKIE_NAME];
    console.log("=== Authentication Middleware ===");
    console.log("Cookie name:", process.env.COOKIE_NAME);
    console.log("All cookies:", req.cookies);
    console.log("All signed cookies:", req.signedCookies);
    console.log("Auth token:", token ? "present" : "missing");

    if (!token) {
      return next(createHttpError(401, "Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token verified, user ID:", decoded.ID);

      const user = await UserModel.findOne({
        _id: decoded.ID,
        role: decoded.role,
      }).select("-password");

      if (!user) {
        console.log("User not found in database");
        return next(createHttpError(401, "User not found"));
      }

      req.user = user;
      next();
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError.message);
      return next(createHttpError(401, "Invalid or expired token"));
    }
  } catch (error) {
    console.error("Authentication error:", error.message);
    return next(createHttpError(500, "Authentication process failed"));
  }
};
