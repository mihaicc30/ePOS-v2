let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const ordersSchema = new Schema({
  orderType: {
    type: String,
    required: true,
    default: "both",
  },
  orderStatus: {
    type: String,
    default: "todo",
  },
  items: {
    type: Array,
    default: [],
  },
  email: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  table: {
    type: Number,
    required: true,
  },
  venueID: {
    type: Number,
    required: true,
  },
  venueName: {
    type: String,
    default: "",
  },
  queueNumber: {
    type: Number,
    default: new Date().getTime(),
  },
  year: {
    type: Number,
    default: new Date().getFullYear(),
  },
  month: {
    type: Number,
    default: new Date().getMonth() + 1,
  },
  day: {
    type: Number,
    default: new Date().getDate(),
  },
  dateTime: {
    type: String,
    default: new Date().toLocaleTimeString('en-GB'),
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

var ordersModel = mongoose.model("orders", ordersSchema, "orders");

module.exports = ordersModel;
