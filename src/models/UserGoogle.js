const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserGoogle = new Schema({
  fullname: String,
  email: String,
  password: String,
  phone: String,
});

module.exports = mongoose.model("UserGoogle", UserGoogle);
