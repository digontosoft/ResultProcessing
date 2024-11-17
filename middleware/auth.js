const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");

const protect = asyncHandler(async (req, res, next) => {
  // console.log("function called ", req.headers);
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      // console.log(decoded);
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  }
  if (!token) {
    res.status(401).json({
      message: "Not authorized, not token",
    });
  }
});

const IsSupperadminOrClassadmin = (req, res, next) => {
  // console.log(req.user);
  if (req.user && req.user.userType === "superadmin" || req.user.userType === "classadmin") {
    next();
  } else {
    res.status(401).json({
      message: "Not authorized as a supperadmin or classadmin",
    });
  }
};
module.exports = {
  protect,
  IsSupperadminOrClassadmin,
};
