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
    default: new Date().toLocaleDateString(),
  },
  date: {
    type: Date,
    default: new Date().toISOString(),
  },
});

var tablelayoutModel = mongoose.model("tablelayout", tablelayoutSchema, "tablelayout");

module.exports = tablelayoutModel;
