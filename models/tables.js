let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const tablesSchema = new Schema({
  tableNumber: {
    type: Number,
    required: true,
  },
  tableVenue: {
    type: Number,
    required: true,
  },
  tableQueueNumber: {
    type: Number,
    required: true,
  },
  tableOpen: {
    type: Boolean,
    required: true,
  },
  tableOpenBy: {
    type: String,
  },
  tableDiscount: {
    type: Number,
    default: 0,
  },
  tableServiceCharge: {
    type: Number,
    default: 0,
  },
  openBy: {
    type: String,
    required: true,
  },
  openByEmail: {
    type: String,
    required: true,
  },
  closedBy: {
    type: String,
    required: true,
  },
  closedByEmail: {
    type: String,
    required: true,
  },
  basket: {
    type: Array,
    default: [],
  },
  paidin: {
    cash: {
      type: Number,
      default: 0,
    },
    card: {
      type: Number,
      default: 0,
    },
    voucher: {
      type: Number,
      default: 0,
    },
    deposit: {
      type: Number,
      default: 0,
    },
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

var tablesModel = mongoose.model("tables", tablesSchema, "tables");

module.exports = tablesModel;
