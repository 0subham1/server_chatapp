const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  recieverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  msgType: {
    type: String,
    enum: ["text", "image"],
  },
  msg: String,
  imgUrl: String,
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Msg", schema);