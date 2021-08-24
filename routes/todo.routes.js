const express = require("express");
const router = express.Router();
const todo = require("../controllers/todo.controller");
const logRequest = require("../middlewares/logRequest");
const verifyToken = require("../middlewares/verifyToken");
const {
  checkBody,
  checkDeadline,
  checkFile,
  checkIfTodoExist,
} = require("../middlewares/todo.middlewares");

router.all("*", [logRequest]);
router.get("/", todo.findAll);
router.post("/", [checkBody, checkDeadline, checkFile], todo.create);
router.patch("/:id", [checkDeadline, checkFile, checkIfTodoExist], todo.update);
router.delete("/:id", checkIfTodoExist, todo.delete);

module.exports = router;
