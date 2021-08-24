const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
  },
  snapshot: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Todo", todoSchema);
