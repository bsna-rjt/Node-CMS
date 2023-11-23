const express = require("express");
// const { blogs, users } = require("./model/index.js");
// const bcrypt = require("bcrypt");

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

// const fs = require("fs"); // built-in fs package for file-handling
const {
  renderEditBlog,
  editBlog,
  addBlog,
  renderAddBlogForm,
  allBlogs,
  singleBlog,
  deleteBlog,
} = require("./controller/blogController.js");
const {
  renderRegisterForm,
  registerUser,
  loginUser,
  renderLoginForm,
} = require("./controller/authController.js");

//telling nodejs to accept the incoming data(parsing data)
app.use(express.json()); //content type = application/json handle
app.use(express.urlencoded({ extended: true })); //content type = application/x-www-form-urlencoded

app.get("/", allBlogs);

//get single blog
app.get("/blogs/:id", singleBlog);

//delete blog
app.get("/delete/:id", deleteBlog);

app.get("/addBlog", renderAddBlogForm);

//api for handling formdata
app.post("/addBlog", upload.single("image"), addBlog);

//edit blog form
app.get("/edit/:id", renderEditBlog);

// To handle form data to edit
app.post("/edit/:id", upload.single("image"), editBlog);

//Register User
app.get("/register", renderRegisterForm);

app.post("/register", registerUser);

//login

app.get("/login", renderLoginForm);

app.post("/login", loginUser);

app.use(express.static("./uploads/")); // path should NOT be keep empty otherwise security vulnerable

const PORT = process.env.PORT;

app.listen(PORT, () => {
  //   console.log("Node js project has started at port " + PORT);
});
