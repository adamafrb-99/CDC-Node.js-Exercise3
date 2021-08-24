if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true,
    // limits: { fileSize: 2 * 1024 * 1024 },
    // abortOnLimit: true,
  })
);

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to the ${dbUrl}!`);
  })
  .catch((err) => {
    console.log("Cannot connect to the database! \n", err);
    process.exit();
  });

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/todo", require("./routes/todo.routes"));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
