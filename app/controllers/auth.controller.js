const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const generateTokens = (payload) => {
  const { role, userName } = payload;
  // Create JWT
  try {
    const accessToken = jwt.sign({ role, userName }, "ACCESS_TOKEN_SECRET", {
      expiresIn: "2d",
    });
    return accessToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.login = async (req, res) => {
  const { userName, passWord } = req.body;
  const user = await User.findOne({
    userName: userName,
    passWord: passWord,
  }).lean();

  if (!user) res.sendStatus(401);
  else {
    try {
      const tokens = generateTokens(user);
      res.send({
        accessToken: tokens,
        _id: user._id,
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(403);
    }
  }
};

exports.logout = async (req, res) => {
  res.sendStatus(204);
};
