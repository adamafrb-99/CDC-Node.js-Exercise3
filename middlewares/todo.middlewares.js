const path = require("path");
const Todo = require("../models/Todo");

// Check if a required field is left blank
const checkBody = (req, res, next) => {
  if (!req.body.description || !req.body.deadline) {
    return res.status(400).json({
      message: "Error! Description, deadline and done must not be empty.",
    });
  }

  next();
};

// Check if deadline is valid
const checkDeadline = (req, res, next) => {
  if (req.body.deadline && new Date(req.body.deadline) < Date.now()) {
    return res
      .status(400)
      .json({ message: "Error! Deadline must be in the future." });
  }

  next();
};

const checkFile = (req, res, next) => {
  const maxFileSize = 2 * 1024 * 1024;
  const allowedExt = [".jpg", ".jpeg", ".png"];

  // Check image size
  if (req.files && req.files.snapshot) {
    if (req.files.snapshot.size > maxFileSize) {
      return res
        .status(413)
        .json({ message: "File size limit has been reach." });
    }

    // Check image extension
    if (!allowedExt.includes(path.extname(req.files.snapshot.name))) {
      return res.status(400).json({
        message: "File must be of type .jpg or .png",
      });
    }
  }

  next();
};

const checkIfTodoExist = async (req, res, next) => {
  let selectedTodo;
  selectedTodo = await Todo.findById(req.params.id);

  if (!selectedTodo) {
    return res.status(400).json({ message: "Item does not exist." });
  }

  res.selectedTodo = selectedTodo;
  next();
};

module.exports = { checkBody, checkDeadline, checkFile, checkIfTodoExist };
