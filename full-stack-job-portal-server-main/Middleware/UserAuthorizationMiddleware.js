const userAuthorizationHandler = (...role) => {
  return (req, res, next) => {
    console.log("=== Authorization Middleware ===");
    console.log("Required roles:", role);
    console.log("User role:", req?.user?.role);
    console.log(
      "User object:",
      req?.user
        ? {
            id: req.user._id,
            role: req.user.role,
            username: req.user.username,
          }
        : "No user"
    );

    const userRole = req?.user?.role;

    if (!role.includes(userRole)) {
      console.log("AUTHORIZATION FAILED: User role not in required roles");
      return res.status(403).json({
        status: false,
        message: "You don't have permission",
      });
    }

    console.log("AUTHORIZATION SUCCESS: User has required role");
    next();
  };
};

// module.exports = userAuthorizationHandler;
module.exports = {
  userAuthorizationHandler: userAuthorizationHandler,
};
