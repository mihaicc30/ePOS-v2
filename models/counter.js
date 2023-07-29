let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const counterSchema = new Schema({
  counter: {
    type: Number,
  },
  countertype: {
    type: String,
  }
});

var counterModel = mongoose.model("counter", counterSchema, "counter");

module.exports = counterModel;