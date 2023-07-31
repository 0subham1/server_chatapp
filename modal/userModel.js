const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    // required: true,
  },
  phone: {
    type: Number,
    trim: true,
    // required: true,
    // unique: true,
    // minlength: 10,
  },
  password: {
    type: String||Number,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    // immutable: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// mongoose.models = {};
module.exports = mongoose.model("users", schema);
