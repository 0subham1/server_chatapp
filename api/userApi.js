const express = require("express");
const router = express.Router();
const users = require("../model/userModel");
const errorHandler = require("../middleware/error");

router.get("/users", async (req, res) => {
  let result = await users.find();
  res.status(200).send({ success: true, data: result ? result : [] });
});

router.get("/users/:_id", async (req, res) => {
  console.log(req.params,"aa");
  let result = await users.findOne(req.params);
  console.log(result,"result")
  // res.status(200).send({ success: true, data: result ? result : [] });

});

router.post("/signup", async (req, res) => {
  let obj = {
    name: req.body.name,
    phone: Number(req.body.phone),
    password: req.body.password.toString(),
    isAdmin: false,
    createdAt: new Date(),
  };
  let exist = await users.findOne({ name: req.body.name });
  console.log(exist, "exist");
  if (exist) {
    errorHandler(res, 403, "user Exists");
  } else if (!obj.name) {
    errorHandler(res, 400, "Please enter name");
  } else if (!obj.phone || obj.phone.toString().length != 10) {
    errorHandler(res, 400, "Please enter 10 digit phone");
  } else if (!obj.password) {
    errorHandler(res, 400, "Please enter password");
  } else {
    let result = await users.create(obj);
    console.log(result, "result");
    res.status(201).send({ success: true, message: "user created" });
  }
});

module.exports = router;
