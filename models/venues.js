let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const venuesSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email required."],
    unique: [true, "Email already registered."],
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
  img: {
    type: String,
    default: "defaultVenue.jpg",
  },
  table: {
    type: [Number],
    default: null,
  },
  coords: {
    type: String,
    required: [true, "Location required."],
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

var venuesModel = mongoose.model("venues", venuesSchema, "venues");

module.exports = venuesModel;
