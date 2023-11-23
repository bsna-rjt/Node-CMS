const { users } = require("../model/index.js");
const bcrypt = require("bcrypt");

exports.renderRegisterForm = (req, res) => {
  res.render("register");
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  await users.create({
    email,
    username,
    password: bcrypt.hashSync(password, 8), //if used 20 then will use more computation power //more hashed password generation if used 20 //laptop gets slow
  });
  res.send("User registered successfully!");
};

exports.renderLoginForm = (req, res) => {
  res.render("login");
};

exports.loginUser = async (req, res) => {
  //access email and password
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send("Please provide email and password!");
  }

  //check if email exists or not
  const user = await users.findAll({
    where: {
      email: email,
    },
  });
  if (user.length == 0) {
    res.send("Invalid email or password!");
  } else {
    //check password matches or not
    const isPasswordMatched = bcrypt.compareSync(password, user[0].password);
    if (!isPasswordMatched) {
      res.send("Loggedin successfully!");
    } else {
      res.send("Invalid password!");
    }
  }
};
