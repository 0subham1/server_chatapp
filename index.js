const express=require("express")
const app=express()
require("./db/config")

const PORT=4000
const cors = require("cors");
app.use(cors());
app.use(express.json());

console.log("heelloo")
app.use("",require("./api/userApi"))


app.listen(PORT)