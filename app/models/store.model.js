const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeSchema = Schema({
  storeId: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  link: {
    type: String,
    require: true,
  },
  limitDay: {
    type: Number,
    require: true,
  },
  listTeams: {
    type: Array,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  click: {
    type: Number,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("store", storeSchema);
