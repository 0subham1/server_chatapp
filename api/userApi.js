const express = require("express");
const router = express.Router();
const users = require("../db/userModel");

router.post("/signup", async (req, res) => {
  let obj = {
    name: req.body.name,
    phone: req.body.phone,
  };
  let result = await users.create(obj);
  res.send(result);
});


module.exports = router;
