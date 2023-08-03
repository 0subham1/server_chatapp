const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  phone: {
    type: Number,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  frndRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sentRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("User", schema);
