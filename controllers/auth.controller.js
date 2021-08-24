const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.findAll = async (req, res) => {
  try {
    const allUsers = await User.find();

    if (!allUsers.length)
      return res
        .status(200)
        .json({ statusCode: 200, message: "There is no user found." });

    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password must not be empty!" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(500)
        .send("User already exists. Please use another email.");
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    res.status(201).send({
      statusCode: 201,
      message: "You have been registered successfully.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password can't be empty!" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist." });

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid)
      return res.status(400).json({ message: "Invalid password!" });

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: 180,
    });

    res
      .status(200)
      .send({ auth: true, message: "You are logged in.", token: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
