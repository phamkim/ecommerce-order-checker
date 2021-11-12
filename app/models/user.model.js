const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// tao model
const userSchema = new Schema({
  userName: {
    type: String,
    require: true,
  },
  passWord: {
    type: String,
    require: true,
  },
  nameBuyer: {
    type: String,
    require: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  role: {
    type: Number,
    require: true,
  },
  team: {
    type: String,
    require: true,
  },
  buyer: {
    type: String,
    require: true,
  },
  rate: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("user", userSchema);
