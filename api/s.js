require("dotenv").config();

const express = require("express");
const app = express(); 
const router = express.Router();

app.use(express.json());
const cors = require("cors");
app.use(cors());

const users = require("../db/usersModel");
const jwt = require("jsonwebtoken");
const jwtKey = "jumpin";

const bcrypt = require("bcryptjs");

//------------------------------------------------
const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    //  token= token.split(' ')[1]
    console.log(token, "token");
    jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send("wrong token");
      } else {
        next();
      }
    });
  } else {
    res.status(403).send("token not found");
  }
};

//-----------------------------------------------

//ADD *
router.post("/signUp", async (req, res) => {
  let salt = await bcrypt.genSalt(10);
  let securePass = await bcrypt.hash(req.body.password, salt);
  let exist = await users.findOne({ name: req.body.name });

  if (exist) {
    res.send("user already exist with given name");
  } else {
    let obj = {
      name: req.body.name,  
      phone: req.body.phone,
      password: securePass,
      isAdmin: req.body.isAdmin,
    };
    let result = await users.create(obj);

    res.send(result);
  }
});

// router.post("/signUp", async (req, res) => {
//     let result = await new users(req.body).save();
//     res.send(result);
//   });

//LOGIN *

router.post("/login", async (req, res) => {
  let result = await users.findOne({
    name: req.body.name,
  });
  if (result) {
    let passCheck = await bcrypt.compare(req.body.password, result.password);
    console.log(passCheck, "passCheck");
    if (passCheck) {
      let auth = jwt.sign({ result }, jwtKey);
      res.send({ result, auth });
    } else {
      if (req.body.password != result.password) {
        res.status(403).send("wrong password");
      } else {
        let auth = jwt.sign({ result }, jwtKey);
        res.send({ result, auth });
      }
    }
  } else {
    res.status(400).send("no user with given name");
  }
});

// .select("-password");
// router.post("/login", async (req, res) => {
//   let result = await users.findOne({
//     name: req.body.name,
//     password: req.body.password,
//   })

//   if (result) {
//     jwt.sign({ result }, jwtKey, { expiresIn: "12h" }, (err, token) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.send({ result, token });
//       }
//     }); // Eg: 60, "2 days", "10h", "7d"
//   }
// });

//UPDATE *
router.put("/editUser/:_id", async (req, res) => {
  let result = await users.updateOne(req.params, { $set: req.body });
  res.send(result);
});

//DELETE *
router.delete("/deleteUser/:_id", async (req, res) => {
  let user = await users.findOne(req.params).select("name");
  if (user) {
    let result = await users.deleteOne(req.params);
    res.send({ result, user });
  } else {
    res.send("no user found with given ID");
  }
});

//GET  LIST *
router.get("/users", async (req, res) => {
  let result = await users.find();
  res.send(result);
});

//GET  UUID *
router.get("/user/:_id", async (req, res) => {
  let result = await users.findOne(req.params);
  if (result) {
    res.send(result);
  } else {
    res.send("no user found");
  }
});

//------------------------------------------------------

module.exports = router;
