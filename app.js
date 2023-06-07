const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const dataRouter = require("./routes/dataRoutes");
const userRouter = require("./routes/userRoutes");
const breweryRouter = require("./routes/breweryRoutes");
const ratingRouter = require("./routes/ratingRoutes");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/data", dataRouter);
app.use("/api/users", userRouter);
app.use("/api/breweries", breweryRouter);
app.use("/api/ratings", ratingRouter);

module.exports = app;
