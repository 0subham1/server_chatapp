require("./db/dbConnect");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false })); //handle formdata
app.use(bodyParser.json());
app.use(passport.initialize());

const jwt = require("jsonwebtoken");

const User = require("./model/chatUserModel");
const Msg = require("./model/chatMsgModel");

const errorHandler = require("./middleware/error");

app.post("/register", async (req, res) => {
  let obj = {
    name: req.body.name,
    phone: Number(req.body.phone),
    password: req.body.password.toString(),
    isAdmin: false,
    createdAt: new Date(),
  };
  let exist = await User.findOne({ name: req.body.name });
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
    let result = await User.create(obj);
    console.log(result, "result");
    res.status(201).send({ success: true, message: "user created" });
  }
});

console.log("hello");
app.listen(port);
