const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = Schema({
  name: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("team", teamSchema);
