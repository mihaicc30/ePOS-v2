let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const posusersSchema = new Schema({
  position: {
    type: String,
    default: null,
  },
  team: {
    type: String,
    default: null,
  },
  worktype: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  courses: {
    type: Array,
    default: [],
  },
  email: {
    type: String,
    required: [true, "Email required."],
    unique: [true, "Email already registered."],
  },
  displayName: {
    type: String,
    default: null,
  },
  autoStore: {
    type: Boolean,
    default: false,
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  lefty: {
    type: Boolean,
    default: false,
  },
  pin: {
    type: String,
    required: [true, "Pin required."],
    unique: [true, "Pin already registered."],
  },
  fingerprint: {
    type: String,
    default: true,
  },
  venueID: {
    type: Number,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
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

var posusersModel = mongoose.model("posusers", posusersSchema, "posusers");

module.exports = posusersModel;
