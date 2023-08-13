const express = require("express");
const port = 3000;
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

const route = require("./routes/index");

app.use("/", route);

app.listen(port, () => {
  console.log(`Ecommerce app listening at http://localhost:${port}`);
});
