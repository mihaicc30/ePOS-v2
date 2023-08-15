let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email required."],
    unique: [true, "Email already registered."],
  },
  firstName: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  profilePhoto: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: true,
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

var userModel = mongoose.model("users", userSchema, "users");

module.exports = userModel;