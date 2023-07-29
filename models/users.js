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
    default: new Date().toLocaleDateString(),
  },
  date: {
    type: Date,
    default: new Date().toISOString(),
  },
});

var userModel = mongoose.model("users", userSchema, "users");

module.exports = userModel;