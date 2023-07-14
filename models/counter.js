let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const counterSchema = new Schema({
  counter: {
    type: Number,
  }
});

var counterModel = mongoose.model("counter", counterSchema, "counter");

module.exports = counterModel;