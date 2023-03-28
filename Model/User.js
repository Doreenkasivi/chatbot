const mongoose = require("mongoose");
const USerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  senderNumber: {
    type: String,
    required: true,
  },
  loggedIn: {
    type: Boolean,
  },
  otp:{
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("User", USerSchema);