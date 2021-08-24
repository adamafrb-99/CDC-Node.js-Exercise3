const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");
const logRequest = require("../middlewares/logRequest");
const verifyToken = require("../middlewares/verifyToken");

router.all("*", logRequest);
router.get("/", verifyToken, auth.findAll);
router.post("/signup", auth.signUp);
router.post("/signin", auth.signIn);

module.exports = router;
