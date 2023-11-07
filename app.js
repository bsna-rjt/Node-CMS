const express = require("express");
const { blogs } = require("./model/index.js");

//requiring multerConfig
const { multer, storage } = require("./middleware/multerConfig.js");
// const multer = require("./middleware/multerConfig.js").multer;
// const storage = require("./middleware/multerConfig.js").storage;
const upload = multer({ storage: storage });

const app = express();

// tell nodejs to require and use .env
require("dotenv").config();

require("./model/index.js");

// tell nodejs that we are using ejs, set everything
app.set("view engine", "ejs");

//telling nodejs to accept the incoming data(parsing data)
app.use(express.json()); //content type = application/json handle
app.use(express.urlencoded({ extended: true })); //content type = application/x-www-form-urlencoded

app.get("/", async (req, res) => {
  const allblogs = await blogs.findAll();
  //   console.log("allblogs", allblogs);
  res.render("allBlogs", { allBlogs: allblogs });
});

//get single blog
app.get("/blogs/:id", async (req, res) => {
  const _id = req.params.id; // here id means mathi ko :id

  //Alternative
  // const {_id}=req.params; //Object destructuring
// console.log("blogs",blogs)
  // fetch/find selected blog's data from table
  const blog = await blogs.findAll({
    where: {
      id: _id
    }
  });

  // const blog=await allBlogs.findByPk(_id);
// console.log("blog",blog)

  res.render("singleBlog", {blog});
});

//delete blog
app.get("/delete/:id",async (req,res)=>{
    const _id=req.params.id;

    //delete the selected blog's data row from table
    await blogs.destroy({
        where:{
        id:_id
        }
    })
    res.redirect("/");
})

app.get("/addBlog", (req, res) => {
  res.render("addBlog");
});

//api for handling formdata
app.post("/addBlog", upload.single("image"), async (req, res) => {
  //   console.log("API hitted", req.body);
  //   console.log("req.file", req.file);

  // const title = req.body.title;
  // const subTitle = req.body.subTitle;

  //ALTERNATIVE
  const { title, subTitle, description } = req.body;

  //  await blogs.create({
  //     title:req.body.title,
  //     subTitle:req.body.subtitle,
  //     description:req.body.description
  // })

  await blogs.create({
    title: title,
    subTitle,
    description,
    imageUrl: req.file.filename,
  });

  res.redirect("/");
});

app.use(express.static("./uploads/")); // path should NOT be keep empty otherwise security vulnerable

const PORT = process.env.PORT;

app.listen(PORT, () => {
  //   console.log("Node js project has started at port " + PORT);
});
