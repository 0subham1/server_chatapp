const express = require("express");
const router = express.Router();
const users = require("../db/userModel");
const cors = require("cors");
app.use(cors());
app.use(express.json());
router.post("/signup", async (req, res) => {
  let obj = {
    name: req.body.name,
    phone: req.body.phone,
  };
  let result = await users.create(obj);
  res.send(result);
});
router.get("/", async (req, res) => {
  res.send("home page");
});

module.exports = router;
