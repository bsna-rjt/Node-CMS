const express = require("express");
const { blogs, users } = require("./model/index.js");
const bcrypt = require("bcrypt");

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

const fs = require("fs"); // built-in fs package for file-handling

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
      id: _id,
    },
  });

  // const blog=await allBlogs.findByPk(_id);
  // console.log("blog",blog)

  res.render("singleBlog", { blog });
});

//delete blog
app.get("/delete/:id", async (req, res) => {
  const _id = req.params.id;

  const blog = await blogs.findAll({
    where :{
      id:_id
    }
  })

const fileName = blog[0].imageUrl;
fs.unlink("./uploads/"+fileName,(err)=>{
  if(err){
    console.log("Error ",err);
  }else{
    console.log("Image Deleted!")
  }
})

  //delete the selected blog's data row from table
  await blogs.destroy({
    where: {
      id: _id,
    },
  });
  res.redirect("/");
});

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

//edit blog form
app.get("/edit/:id", async (req, res) => {
  //find the blog with coming id
  const id = req.params.id;
  const blog = await blogs.findAll({
    where: {
      id: id,
    },
  });
  res.render("editBlog", { blog }); //"editBlog" is .ejs filename
});

// To handle form data to edit
app.post("/edit/:id", upload.single("image"), async (req, res) => {
  // console.log("req.body",req.body);
  // console.log("req.file",req.file);
  const id = req.params.id;
  const oldData = await blogs.findAll({
    where: {
      id: id,
    },
  });
  const { title, subTitle, description } = req.body;
  const fileName = req.file?req.file.filename:'';
  const oldFileName = oldData[0].imageUrl;
  // const lengthToCut = process.env.BACKEND_URL.length;
  // const oldFileNameAfterCut = oldFileName.slice(lengthToCut);
  // console.log("oldFileName",oldFileName);

  if (fileName) {
    // delete old image only if new uploaded
    fs.unlink("./uploads/" + oldFileName, (err) => {
      if (err) {
        // console.log("Error Occured ", err);
      } else {
        // console.log("Old image deleted successfully!");
      }
    });
  }

  await blogs.update({
    title,
    subTitle,
    description,
    imageUrl: fileName ? fileName : oldFileName,
  },{
    where:{
      id:id
    }
  });

  // res.send("Blog Edited Successfully!");
  res.redirect("/blogs/"+id);
});

//Register User
app.get("/register",(req,res)=>{
  res.render("register")
})

app.post("/register",async(req,res)=>{
  const {username,email,password} = req.body;
  await users.create({
    email,
    username,
    password : bcrypt.hashSync(password,8) //if used 20 then will use more computation power //more hashed password generation if used 20 //laptop gets slow
  })
  res.send("User registered successfully!")
})

app.use(express.static("./uploads/")); // path should NOT be keep empty otherwise security vulnerable

const PORT = process.env.PORT;

app.listen(PORT, () => {
  //   console.log("Node js project has started at port " + PORT);
});
