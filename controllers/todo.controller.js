const fs = require("fs");
const Todo = require("../models/Todo");
const imgDir = "public/snapshots/";

exports.findAll = async (req, res) => {
  try {
    const allTodos = await Todo.find();

    if (!allTodos.length) {
      return res.status(200).json({
        message: "There is no item in the list.",
      });
    }

    res.status(200).json(allTodos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { description, deadline } = req.body;
    let snapshot;
    let snapshotToSave;

    // If user attach an image, upload it to the server
    if (req.files && req.files.snapshot) {
      snapshot = req.files.snapshot;
      snapshotToSave = imgDir + Date.now() + "_" + snapshot.name;

      snapshot.mv(snapshotToSave, (err) => {
        if (err) {
          return res.json({
            message: err.message,
          });
        }
      });
    }

    const todo = new Todo({
      description,
      deadline,
      done: false,
      snapshot: snapshot ? snapshotToSave : null,
    });

    await todo.save();

    res.status(201).json({
      message: "Successfully created new to-do item.",
      data: todo,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  let snapshot;
  let snapshotToSave;

  try {
    const selectedTodo = res.selectedTodo;

    if (req.body.description) selectedTodo.description = req.body.description;

    if (req.body.deadline) selectedTodo.deadline = req.body.deadline;

    if (req.body.done) selectedTodo.done = req.body.done;

    if (req.files && req.files.snapshot) {
      snapshot = req.files.snapshot;
      snapshotToSave = imgDir + Date.now() + "_" + snapshot.name;

      await snapshot.mv(snapshotToSave, (err) => {
        if (err) {
          return res.json({
            message: err.message,
          });
        }
      });

      fs.unlink(selectedTodo.snapshot, (err) => {
        if (err) {
          return res.json({ message: err.message });
        }
      });

      selectedTodo.snapshot = snapshotToSave;
    }

    await selectedTodo.save();

    res.status(200).json({
      message: "Item has been successfully updated.",
      data: selectedTodo,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const selectedTodo = res.selectedTodo;

    if (selectedTodo.snapshot) {
      fs.unlink(selectedTodo.snapshot, (err) => {
        if (err) {
          return res.json({ message: err.message });
        }
      });
    }

    await selectedTodo.remove();

    res.status(200).json({
      message: "Item has been successfully deleted.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
