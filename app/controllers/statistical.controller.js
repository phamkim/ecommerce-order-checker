const Order = require("../models/order.model");
const Store = require("../models/store.model");
const Team = require("../models/team.model");
const User = require("../models/user.model");

exports.statisticalTeams = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: "$buyer",
          total: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "buyer",
          as: "detail",
        },
      },
    ]);
    res.send({ result: result });
  } catch (error) {
    res.send({ result: "fail" });
  }
};
