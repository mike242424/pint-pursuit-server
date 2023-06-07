require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGODB_URI)
  // .connect("mongodb://localhost/pint-pursuit")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
