const express = require("express");
const app = express();
const router = express.Router();

const cors = require("cors");
app.use(cors());
app.use(express.json());

const users=require("../db/userModel")

router.post("/signup", async (req, res) => {
  let obj = {
    name: req.body.name,
    phone: req.body.phone,
  };
  let result = await users.create(obj);
  res.send(result);
});
router.get("/", async (req, res) => {
    
    res.send("world");
  });

module.exports=router