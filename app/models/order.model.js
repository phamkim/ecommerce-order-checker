const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema({
  zipCode: {
    type: String,
    require: true,
  },
  trackingUSP: {
    type: String,
    require: true,
  },
  dateOrder: {
    type: Date,
    require: true,
  },
  dateCreate: {
    type: Date,
    require: true,
  },
  dateDeli: {
    type: Date,
    require: true,
  },
  orderZipCode: {
    type: String,
    require: true,
  },
  amount: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
  store: {
    type: String,
    require: true,
  },
  buyer: {
    type: String,
    require: true,
  },
  team: {
    type: String,
    require: true,
  },
  note: {
    type: String,
    require: true,
  },
  realPrice: {
    type: String,
    require: true,
  },
  state: {
    type: String,
    require: true,
    // 0: đang sử lý
    // 1: yêu cầu hủy
    // 2: đã hủy
    // 3: đơn bị trả lại
  },
});

module.exports = mongoose.model("order", orderSchema);
