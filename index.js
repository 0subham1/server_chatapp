const express=require("express")
const app=express()
const cors=require("cors")
app.use(cors()) 


app.use(express.json())
require("./db/config")

const PORT=4000


console.log("heelloo")



app.listen(PORT)