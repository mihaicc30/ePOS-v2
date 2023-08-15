let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const categoriesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: [],
  },
  
  dateString: {
    type: String,
    default: new Date().toLocaleDateString('en-GB'),
  },
  date: {
    type: Date,
    default: new Date().toISOString('en-GB'),
  },
});

var categoriesModel = mongoose.model("categories", categoriesSchema, "categories");

module.exports = categoriesModel;