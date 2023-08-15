let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const receiptSchema = new Schema({
  items: {
    type: Array,
    default: [],
  },
  email: {
    // user who bought it - can be POS user, can be customer user
    type: String,
  },
  table: {
    type: Number,
    required: true,
  },
  pubId: {
    type: String,
    required: true,
  },
  pubName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  receiptNumber: {
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
  vat: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: Array,
  },
  dateString: {
    type: String,
    default: new Date().toLocaleDateString('en-GB'),
  },
  tableOpenAt: {
    type: Date,
    default: new Date().toISOString('en-GB'),
  },
  tableClosedAt: {
    type: Date,
    default: new Date().toISOString('en-GB'),
  },
});

var receiptModel = mongoose.model("receipts", receiptSchema, "receipts");

module.exports = receiptModel;
