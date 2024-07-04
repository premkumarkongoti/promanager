const jwt = require("jsonwebtoken");

const verifyJwtToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
        success: false,
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Unauthorized: Invalid token",
          success: false,
        });
      }

      req.body.userId = decoded.userId;
      next();
    });
  } catch (error) {
    console.error("Error in JWT verification:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = verifyJwtToken;
