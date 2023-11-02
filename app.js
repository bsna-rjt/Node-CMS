const express = require("express")
const app = express()

// tell nodejs to require and use .env
 require("dotenv").config()

// tell nodejs that we are using ejs, set everything
app.set("view engine","ejs")

app.get("/",(req,res)=>{
    res.render("allBlogs")
})

app.get("/addBlog",(req,res)=>{
    res.render("addBlog")
})

const PORT  = process.env.PORT

app.listen(PORT,()=>{
    console.log("Node js project has started at port " + PORT)
})