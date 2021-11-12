const User = require("../models/user.model");

// them moi user
exports.addUser = async (req, res) => {
  if (req.role !== "1") {
    const { userName, passWord, team, nameBuyer, fullName, role, rate } = req.body;
    const newUserData = {
      nameBuyer,
      fullName,
      role,
      userName,
      passWord,
      team: team || '',
      rate,
    };
    let err = [];
    if (!nameBuyer) err.push({ mg: "nameBuyer is not required" });
    if (!fullName) err.push({ mg: "fullName is not required" });
    if (!role) err.push({ mg: "role is not required" });
    else {
      const newUser = new User(newUserData);
      newUser.buyer = newUser._id;
      await newUser.save();
      res.send({ result: "ok" });
    }
    res.send({ err: err });
  } else {
    res.send({ result: "you not admin" });
  }
};

// lay danh sach user
exports.listUser = async (req, res) => {
  const query = req.query;
  const team = query.team || "";
  const filters = {
    team: { $regex: team },
  };
  const result = await User.find(filters).sort({ _id: -1 }).lean();
  res.send({ result: result, count: result.lenght });
};

// tim user theo id
exports.findUser = async (req, res) => {
  const result = await User.findOne({ _id: req.params.id }).lean();
  res.send({ result: result });
};

// tim user theo id va update
exports.updateUser = async (req, res) => {
  const { userName, passWord, team, nameBuyer, fullName, role, rate } =
    req.body;
  const newUserData = {
    nameBuyer,
    fullName,
    role,
    userName,
    passWord,
    team: team || '',
    rate,
  };
  await User.findOneAndUpdate({ _id: req.params.id }, newUserData);
  res.send({ result: "ok" });
};

// xoa user
exports.deleteUser = async (req, res) => {
  if (req.role !== "1") {
    await User.findOneAndRemove({ _id: req.params.id }).lean();
    res.send({ result: "ok" });
  } else {
    res.send({ result: "you not admin" });
  }
};
