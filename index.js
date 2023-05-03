require("./db/config")
const express=require("express")
const app=express()

const cors = require("cors");
app.use(cors());
app.use(express.json());

console.log("heelloo")
app.use(require("./api/userApi"))

app.listen(4000)