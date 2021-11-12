const Team = require("../models/team.model");

// them moi Team
exports.addTeam = async (req, res) => {
  if (req.role !== "1") {
    const { name  } = req.body;
    const newTeamData = {
      name
    };
    console.log(name);
    const newTeam = new Team(newTeamData);
    await newTeam.save();
    res.send({ result: "ok" });
  } else {
    res.send({ result: "you not admin" });
  }
};

// lay danh sach Team
exports.listTeam = async (req, res) => {
  const result = await Team.find().sort({_id:-1}).lean();
  res.send({ result: result });
};

// tim Team theo id
exports.findTeam = async (req, res) => {
  const result = await Team.findOne({ _id: req.params.id }).lean();
  res.send({ result: result });
};

// tim Team theo id va update
exports.updateTeam = async (req, res) => {
  if (req.role !== "1") {
    const { name} = req.body;
    const newTeamData = {
      name
    };
    await Team.findOneAndUpdate({ _id: req.params.id }, newTeamData);
    res.send({ result: "ok" });
  } else {
    res.send({ result: "you not admin" });
  }
};

// xoa Team
exports.deleteTeam = async (req, res) => {
  if (req.role !== "1") {
    await Team.findOneAndRemove({ _id: req.params.id }).lean();
    res.send({ result: "ok" });
  } else {
    res.send({ result: "you not admin" });
  }
};
