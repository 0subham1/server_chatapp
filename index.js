require("./db/dbConnect");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const multer = require("multer");

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
  try {
    let obj = {
      name: req.body.name,
      password: req.body.password.toString(),
      createdAt: new Date(),
    };
    let exist = await User.findOne({ name: req.body.name });
    console.log(exist, "userexist");
    if (exist) {
      errorHandler(res, 200, "user Exists");
    } else if (!obj.name) {
      errorHandler(res, 200, "Please enter name");
    } else if (!obj.password) {
      errorHandler(res, 200, "Please enter password");
    } else {
      let result = await User.create(obj);
      if (result) {
        res.status(201).send({ success: true, message: "user created" });
      } else {
        errorHandler(res, 200, "user not created");
      }
    }
  } catch (err) {
    console.log(err, "err");
    errorHandler(res, 500, "server err ");
  }
});

const createAuth = (userId) => {
  let auth = jwt.sign({ userId }, "subham12", { expiresIn: "1h" });
  return auth;
};

app.post("/signIn", async (req, res) => {
  try {
    const { name, password } = req.body;
    let user = await User.findOne({ name: name });
    if (!user) return errorHandler(res, 200, "no user found");
    if (user && user.password != password)
      return errorHandler(res, 200, "wrong pass");

    let auth = createAuth(user._id);
    auth &&
      res
        .status(200)
        .send({ user, auth, success: true, message: "login success" });
  } catch (err) {
    console.log(err, "err");
    errorHandler(res, 500, "Incorrect Details");
  }
});

app.get("/users", async (req, res) => {
  try {
    let users = await User.find();
    res.status(200).send({ users, success: true, message: "users" });
  } catch (err) {
    console.log(err, "err");
    errorHandler(res, 500, "server err ");
  }
});

app.get("/users/:_id", async (req, res) => {
  try {
    let user = await User.findOne(req.params);
    res.status(200).send({ user, success: true, message: "users" });
  } catch (err) {
    console.log(err, "err");
    errorHandler(res, 500, "server err ");
  }
});

app.post("/request/send", async (req, res) => {
  try {
    const { userId, clientId } = req.body;
    let client = await User.findOne({ _id: clientId });
    let exist = client?.frndRequest?.some((a) => a == userId);
    console.log(exist, "exist");
    if (!exist) {
      // let result = await users.updateOne(req.params, { $set: req.body });
      await User.findByIdAndUpdate(clientId, {
        $push: { frndRequest: userId },
      });
      await User.findByIdAndUpdate(userId, {
        $push: { sentRequest: clientId },
      });
      res.status(200).send({ success: true, message: "request sent" });
    } else {
      errorHandler(res, 200, "request already sent ");
    }
  } catch (err) {
    console.log(err, "err");
    errorHandler(res, 500, "server err");
  }
});

app.post("/request/accept", async (req, res) => {
  const { userId, clientId } = req.body;
  try {
    let user = await User.findOne({ _id: userId }); //me
    let client = await User.findOne({ _id: clientId }); //him
    console.log(user, client, " user client");
    user.friends.push(clientId);
    client.friends.push(userId);

    user.frndRequest = user.frndRequest.filter((a) => a != clientId);
    client.sentRequest = client.sentRequest.filter((a) => a != userId);

    console.log(user, client, " user client2");
    res.status(200).send({ success: true, message: "request accepted" });
  } catch (err) {
    console.log(err, "err");
    errorHandler(res, 500, "server err");
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/msg", upload.single("imageFile"), async (req, res) => {
  try {
    console.log(req?.file?.path, "req.file.path");
    const { userId, clientId, msgType, msg } = req.body;
    let obj = {
      userId,
      clientId,
      msgType,
      msg: msgType === "text" ? msg : "",
      timeStamp: new Date(),
      imgUri: msgType === "image" ? req.file.path : null,
    };
    console.log(obj, "obj");
    let result = await Msg.create(obj);
    console.log(result, "result");
    res.status(200).send({ success: true, message: "Msg sent!" });
  } catch (err) {
    console.log(err, "err");
    errorHandler(res, 500, "server err1");
  }
});

app.get("/msg/:userId/:clientId", async (req, res) => {
  try {
    const { userId, clientId } = req.params;
    const messages = await Msg.find({
      $or: [
        { userId: userId, clientId: clientId },
        { userId: clientId, clientId: userId },
      ],
    });
    // .populate("userId", "_id name");
    res.status(200).send({ messages, success: true, message: "Conversation" });
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
