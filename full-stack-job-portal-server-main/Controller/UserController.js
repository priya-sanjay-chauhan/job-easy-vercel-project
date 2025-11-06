const UserModel = require("../Model/UserModel");
const createError = require("http-errors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWTGenerator = require("../Utils/JWTGenerator");

exports.getAllUser = async (req, res, next) => {
  try {
    const result = await UserModel.find({}).select("-password");
    if (result.length !== 0) {
      res.status(200).json({
        status: true,
        result,
      });
    } else {
      next(createError(200, "User list is empty"));
    }
  } catch (error) {
    next(createError(500, error.message));
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const me = req.user;
    if (!me) {
      next(createError(500, "Please login first"));
    } else {
      res.status(200).json({
        status: true,
        result: me,
      });
    }
  } catch (error) {
    next(createError(500, error.message));
  }
};

exports.logOut = async (req, res, next) => {
  try {
    res
      .cookie(process.env.COOKIE_NAME, "", {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        expires: new Date(0), // Set to a date in the past
        path: "/", // Ensure this matches the path set during login
      })
      .status(200)
      .json({
        status: true,
        message: "Logout done",
      });
  } catch (error) {
    next(createError(500, error.message));
  }
};

exports.getSingleUser = async (req, res, next) => {
  res.send("get single user");
};

exports.addUser = async (req, res, next) => {
  const data = req.body;
  try {
    console.log("Registration attempt with data:", {
      ...data,
      password: "[REDACTED]",
    });

    const isUserExists = await UserModel.findOne({ email: data.email });
    if (isUserExists) {
      console.log("User already exists with email:", data.email);
      next(createError(500, "Email Already exists"));
    } else {
      const isFirstUser = (await UserModel.countDocuments()) === 0;
      // If it's the first user, make them admin, otherwise use the requested role
      req.body.role = isFirstUser ? "admin" : data.role || "user";
      console.log("Creating new user with role:", req.body.role);

      const newUser = new UserModel(data);
      console.log("Created user model instance");

      try {
        const result = await newUser.save();
        console.log("User saved successfully with ID:", result._id);

        res.status(200).json({
          status: true,
          message: "Registered Successfully",
          userId: result._id, // Adding this for debugging
        });
      } catch (saveError) {
        console.error("Error saving user:", saveError);
        next(createError(500, `Error saving user: ${saveError.message}`));
      }
    }
  } catch (error) {
    console.error("Registration error:", error);
    next(createError(500, error.message));
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    console.log("Login attempt with:", { email: req.body.email });
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(400, "Email and password are required"));
    }

    const isUserExists = await UserModel.findOne({ email });
    console.log("User exists:", !!isUserExists);

    if (isUserExists) {
      const isPasswordMatched = await bcrypt.compare(
        password,
        isUserExists.password
      );
      console.log("Password match:", isPasswordMatched);

      if (isPasswordMatched) {
        const tokenObj = {
          ID: isUserExists._id,
          role: isUserExists.role,
        };
        const TOKEN = JWTGenerator(tokenObj);

        const one_day = 1000 * 60 * 60 * 24; //since token expire in 1day

        try {
          // Set cookie for local development
          res.cookie(process.env.COOKIE_NAME, TOKEN, {
            maxAge: one_day,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            signed: true,
            sameSite: "none",
            path: "/",
          });

          console.log("Cookie set successfully");

          return res.status(200).json({
            status: true,
            message: "Login Successfully",
          });
        } catch (cookieError) {
          console.error("Error setting cookie:", cookieError);
          return next(createError(500, "Error setting authentication cookie"));
        }
      } else {
        return next(createError(401, "Invalid email or password"));
      }
    } else {
      return next(createError(401, "Invalid email or password"));
    }
  } catch (error) {
    console.error("Login error:", error);
    return next(createError(500, `Login failed: ${error.message}`));
  }
};
exports.updateUser = async (req, res, next) => {
  const data = req.body;
  try {
    if (req?.user?.email !== data?.email) {
      next(createError(500, `You have no permission to update`));
    } else {
      const updateUser = await UserModel.updateOne(
        { _id: req.user._id },
        { $set: data }
      );

      if (updateUser.nModified > 0) {
        const updatedUser = await UserModel.findById(req.user._id).select(
          "-password"
        );
        res.status(200).json({
          status: true,
          message: "Profile Updated",
          result: updatedUser,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "No changes were made",
          result: null,
        });
      }
    }
  } catch (error) {
    next(createError(500, `Something went wrong: ${error.message}`));
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      next(createError(400, "Invalid User ID format"));
    }

    const isUserExists = await UserModel.findOne({ _id: id });
    if (!isUserExists) {
      res.status(500).json({
        status: false,
        message: "User not found",
      });
    } else {
      const result = await UserModel.findByIdAndDelete(id);
      res.status(200).json({
        status: true,
        message: "User Deleted",
      });
    }
  } catch (error) {
    next(createError(500, `something wrong: ${error.message}`));
  }
};

exports.deleteAllUser = async (req, res, next) => {
  try {
    result = await UserModel.deleteMany({});
    res.status(201).json({
      status: true,
      message: "All userd deleted",
    });
  } catch (error) {
    next(createError(500, `something wrong: ${error.message}`));
  }
};
