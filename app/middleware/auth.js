const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, "ACCESS_TOKEN_SECRET");
    req.role = decoded.role;
    console.log(decoded.role);
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
};

module.exports = verifyToken;
