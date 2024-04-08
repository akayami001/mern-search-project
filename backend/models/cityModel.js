const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const citySchema = new Schema({
  cityName: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
  },
  uuid: {
    type: String,
    default: uuidv4(),
  },
});

module.exports = mongoose.model("City", citySchema);
