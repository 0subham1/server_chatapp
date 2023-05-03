const mongoose = require("mongoose");

const schema =  mongoose.Schema({
  name: String,
  phone: Number,
});

module.exports = mongoose.model("users", schema);
