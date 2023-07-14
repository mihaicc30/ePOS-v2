let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const basketsSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  course: {
    type: Number,
    required: true,
  },
});

var basketsModel = mongoose.model("baskets", basketsSchema, "baskets");

module.exports = basketsModel;