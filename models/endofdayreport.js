let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const endofdayreportsSchema = new Schema({
  totalQtySold: {
    type: Number,
    default: 0,
  },
  totalAmountSold: {
    type: Number,
    default: 0,
  },
  totalAmountSoldNoDiscount: {
    type: Number,
    default: 0,
  },
  totalSoldCategory: {
    type: Object,
    default: {},
  },
  totalSoldSubcategory: {
    type: Object,
    default: {},
  },
  totalSoldProducts: {
    type: Object,
    default: {},
  },
  totalSoldUsers: {
    type: Object,
    default: {},
  },
  cogs: {
    type: Object,
    default: {},
  },
  cogsTotal: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: Object,
    default: {},
  },
  staffMembers: {
    type: Number,
    default: 0,
  },
  staffMembersF: {
    type: Number,
    default: 0,
  },
  forcastedHours: {
    type: Number,
    default: 0,
  },
  actualHours: {
    type: Number,
    default: 0,
  },
  totalWages: {
    type: Number,
    default: 0,
  },
  totalWagesF: {
    type: Number,
    default: 0,
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

var endofdayreportsModel = mongoose.model("endofdayreports", endofdayreportsSchema, "endofdayreports");

module.exports = endofdayreportsModel;
