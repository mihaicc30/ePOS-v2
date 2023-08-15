let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const tablelayoutSchema = new Schema({
  fromvenueid: {
    type: Number,
    required: true,
  },
  layout: {
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

var tablelayoutModel = mongoose.model("tablelayout", tablelayoutSchema, "tablelayout");

module.exports = tablelayoutModel;
