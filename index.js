require("./db/dbConnect");
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());
app.use(express.json());

// app.use("", require("./api/userApi"));
app.use(require("./api/userApi"));

app.get("/", async (req, res) => {
  res.send("home page");
});
console.log("index run")
app.listen(5000);
