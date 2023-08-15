let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const targetsSchema = new Schema({
  dateRange: {
    type: String,
    required: [true, "Target date required."],
  },
  Sunday: {
    type: Number,
    default: 0,
  },
  Monday: {
    type: Number,
    default: 0,
  },
  Tuesday: {
    type: Number,
    default: 0,
  },
  Wednesday: {
    type: Number,
    default: 0,
  },
  Thursday: {
    type: Number,
    default: 0,
  },
  Friday: {
    type: Number,
    default: 0,
  },
  Saturday: {
    type: Number,
    default: 0,
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

var targetsModel = mongoose.model("targets", targetsSchema, "targets");

module.exports = targetsModel;
