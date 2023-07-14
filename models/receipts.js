let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const receiptSchema = new Schema({
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  email: {
    // user who bought it
    type: String,
  },
  table:{
    type: Number,
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
    default: new Date().getTime()
  },
  year: {
    type: String,
    default: new Date().getFullYear()
  },
  month: {
    type: String,
    default: new Date().getMonth() + 1
  },
  vat: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    default: "card",
  },
  cardNumber: {
    type: String,
    required: true,
    default: "1234",
  },

  date: {
    type: Date,
    default: new Date(),
  },
});

var receiptModel = mongoose.model("receipts", receiptSchema, "receipts");

module.exports = receiptModel;
