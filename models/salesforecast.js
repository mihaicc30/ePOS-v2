let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const salesforecastSchema = new Schema({
  dateRange: {
    type: String,
    required: [true, "Target date required."],
  },
  predictions: {
    type: Array,
    default: [],
  },
  average: {
    type: Number,
    default: 0,
  },
  actual: {
    type: Number,
    default: 0,
  },
  parameters:{
    type:Object,
    default:{},
  },
  venueID: {
    type: String,
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

var salesforecastModel = mongoose.model("salesforecast", salesforecastSchema, "salesforecast");

module.exports = salesforecastModel;
