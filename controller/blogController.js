const { blogs } = require("../model/index.js");
const fs = require("fs"); // built-in fs package for file-handling

exports.renderEditBlog = async (req, res) => {
  //find the blog with coming id
  const id = req.params.id;
  const blog = await blogs.findAll({
    where: {
      id: id,
    },
  });
  res.render("editBlog", { blog }); //"editBlog" is .ejs filename
};

exports.editBlog = async (req, res) => {
  // console.log("req.body",req.body);
  // console.log("req.file",req.file);
  const id = req.params.id;
  const oldData = await blogs.findAll({
    where: {
      id: id,
    },
  });
  const { title, subTitle, description } = req.body;
  const fileName = req.file ? req.file.filename : "";
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

  await blogs.update(
    {
      title,
      subTitle,
      description,
      imageUrl: fileName ? fileName : oldFileName,
    },
    {
      where: {
        id: id,
      },
    }
  );

  // res.send("Blog Edited Successfully!");
  res.redirect("/blogs/" + id);
};

exports.addBlog = async (req, res) => {
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
};

exports.renderAddBlogForm = (req, res) => {
  res.render("addBlog");
};

exports.singleBlog = async (req, res) => {
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
};

exports.deleteBlog = async (req, res) => {
  const _id = req.params.id;

  const blog = await blogs.findAll({
    where: {
      id: _id,
    },
  });

  const fileName = blog[0].imageUrl;
  fs.unlink("./uploads/" + fileName, (err) => {
    if (err) {
      console.log("Error ", err);
    } else {
      console.log("Image Deleted!");
    }
  });

  //delete the selected blog's data row from table
  await blogs.destroy({
    where: {
      id: _id,
    },
  });
  res.redirect("/");
};

exports.allBlogs = async (req, res) => {
  const allblogs = await blogs.findAll();
  //   console.log("allblogs", allblogs);
  res.render("allBlogs", { allBlogs: allblogs });
};
