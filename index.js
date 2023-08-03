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

app.post("/signUp", async (req, res) => {
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

const createAuth = (userId) => {
  let auth = jwt.sign({ userId }, "subham12", { expiresIn: "1h" });
  return auth;
};

app.post("/signIn", async (req, res) => {
  let result = await User.findOne({ name: req.body.name });
  if (result && result.password == req.body.password) {
    let auth = createAuth(result._id);
    res.status(200).send({ result, auth });
  } else {
    errorHandler(res, 400, "incorrect name/password ");
  }
});

app.post("/signIn2", (req, res) => {
  User.findOne({ name: req.body.name })
    .then((dbUser) => {
      if (dbUser && dbUser.password == req.body.password) {
        res.status(200).send({ dbUser, auth });
      } else {
        errorHandler(res, 400, "incorrect name/password ");
      }
    })
    .catch((err) => {
      errorHandler(res, 500, "server err");
      console.log("err", err, "err");
    });
});

app.get("/users", (req, res) => {
  User.find()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err, "err");
      errorHandler(res, 500, "server err");
    });
});

app.post("/request/send", async (req, res) => {
  const { userId, receiverId } = req.body;
  try {
    await User.findByIdAndUpdate(receiverId, {
      $push: { recievedRequest: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $push: { sentRequest: receiverId },
    });

    res.status(200).send({ success: true, message: "request sent" });
  } catch (err) {
    console.log(err, "err");
    errorHandler(res, 500, "server err");
  }
});

//--------------------

app.get("/", (req, res) => {
  res.send("hello world");
});

console.log("hello");
app.listen(port);
