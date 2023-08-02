const mongoose = require("mongoose");

const DB_URL =
  "mongodb+srv://0subhamgupta1:subham12@gamedevcluster.nxytf9k.mongodb.net/?retryWrites=true&w=majority";

// 0subhamgupta1: username
// subham12:password

mongoose
  .connect(DB_URL, {
    dbName: "chatapp",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err, "err");
  });
 