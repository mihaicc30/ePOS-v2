let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const rotaSchema = new Schema({
  week: {
    type: Number,
    required: true,
  },
  weekRange: {
    type: String,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  roted: {
    type: Object,
    default: {},
  },
  venueID: {
    type: Number,
    required: true,
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

var rotaModel = mongoose.model("rota", rotaSchema, "rota");

module.exports = rotaModel;
