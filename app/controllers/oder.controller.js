const Order = require("../models/order.model");
const Store = require("../models/store.model");
Date.prototype.format = function () {
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth();
  var curr_year = d.getFullYear();
  return curr_year + "/" + curr_month + "/" + curr_date;
};

// them moi Order
exports.addOrder = async (req, res) => {
  const {
    zipCode,
    trackingUSP,
    dateOrder,
    dateDeli,
    orderZipCode,
    amount,
    price,
    store,
    buyer,
    team,
  } = req.body;
  const today = new Date();
  console.log(today)
  var dateCreate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  console.log(dateCreate);
  const newOrderData = {
    zipCode,
    trackingUSP,
    dateOrder,
    dateDeli,
    dateCreate,
    orderZipCode,
    amount,
    price,
    store,
    buyer,
    team,
    state: "0"
  };
  console.log(newOrderData);
  const has = trackingUSP ? await Order.find({ $or: [{ orderZipCode: orderZipCode }, { trackingUSP: trackingUSP }] }).lean() : await Order.find({ orderZipCode: orderZipCode }).lean();
  if (has.length > 0) {
    console.log("has:" + has)
    res.send({ result: "has" });
  } else {
    const newOrder = new Order(newOrderData);
    await newOrder.save();
    console.log(newOrder);
    res.send({ result: "ok" });
  }
};

// lay danh sach Order
exports.orders = async (req, res) => {
  const query = req.query;
  const tormorow = new Date(query.dateTo)
  tormorow.setDate(tormorow.getDate() + 1)
  let page = query.page;
  let limit = query.limit;
  let totalPrice = 0.0;
  let realPrice = 0.0;
  const dateFrom = query.dateFrom || "2018-01-01";
  const dateTo = tormorow || "2100-01-01";
  const zipCode = query.zipCode || "";
  const store = query.store || "";
  const buyer = query.buyer || "";
  const team = query.team || "";
  const state = query.state || "0";
  const filters = {
    zipCode: { $regex: zipCode },
    store: { $regex: store },
    buyer: { $regex: buyer },
    team: { $regex: team },
    state: { $regex: state },
    dateCreate: {
      $gt: new Date(dateFrom),
      $lt: new Date(dateTo),
    },
  };
  if (page && limit) {
    //get page
    page = parseInt(page);
    limit = parseInt(limit);
    if (page < 0) page = 1;
    const skip = (page - 1) * limit;
    try {
      const result = await Order.find(filters)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      const count = await Order.find(filters);
      try {
        count.forEach(element => {
          totalPrice += parseFloat(element.amount) * parseFloat(element.price);
          realPrice += parseFloat(element.realPrice);
        });
      } catch (error) {

      }
      res.send({
        count: count.length,
        result: result,
        totalPrice: totalPrice,
        realPrice: realPrice
      });
    } catch (error) {
      res.send({ result: "fail" });
    }
  } else {
    //get all
    const result = []
    try {
      const listOrders = await Order.find(filters).sort({ _id: -1 }).lean();
      const listStores = await Store.find({ status: 'active' }).sort({ _id: -1 }).lean();
      try {
        listOrders.forEach(order => {
          listStores.forEach(store => {
            if (order.store === store.storeId && store.status === 'active') {
              result.push(order);
              totalPrice += parseFloat(order.amount) * parseFloat(order.price);
              realPrice += parseFloat(order.realPrice);
            }
          });
        });
      } catch (error) {
        console.log(error);
      }
      res.send({
        result: result,
        count: result.length,
        totalPrice: totalPrice,
        realPrice: realPrice
      });
    } catch (error) {
      res.send({ result: "fail" });
    }
  }
};

// tim Order theo id
exports.findOrder = async (req, res) => {
  const result = await Order.findOne({
    _id: req.params.id,
  }).lean();
  res.send({ result: result });
};

// tim Order theo id va update
exports.updateOrder = async (req, res) => {
  const {
    zipCode,
    trackingUSP,
    dateOrder,
    dateDeli,
    orderZipCode,
    amount,
    price,
    note,
    realPrice,
    state
  } = req.body;
  const newOrderData = {
    zipCode,
    trackingUSP,
    dateOrder,
    dateDeli,
    orderZipCode,
    amount,
    price,
    note,
    realPrice,
    state
  };

  const has = trackingUSP ? await Order.find({ _id: { $ne: req.params.id }, $or: [{ orderZipCode: orderZipCode }, { trackingUSP: trackingUSP }] }).lean() : await Order.find({ orderZipCode: orderZipCode, _id: { $ne: req.params.id } }).lean();
  if (has.length > 0) {
    res.send({ result: "fail" });
  } else {
    await Order.findOneAndUpdate({ _id: req.params.id }, newOrderData);
    res.send({ result: "ok" });
  }

};

// xoa Order
exports.deleteOrder = async (req, res) => {
  if (req.role !== "1") {
    await Order.findOneAndRemove({ _id: req.params.id }).lean();
    res.send({ result: "ok" });
  } else {
    res.send({ result: "you not admin" });
  }
};
