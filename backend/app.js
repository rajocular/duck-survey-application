const express = require('express');
const bodyParser = require("body-parser");
require('./database/mongodb');

const userRouter = require('./routers/user');
const surveyRouter = require('./routers/survey');
const categoryRouter = require('./routers/category');
const foodRouter = require('./routers/food');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use("/", express.static(path.join(__dirname, "duckfeed")));

app.use("/admin", userRouter);
app.use("/api/surveys", surveyRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/foods", foodRouter);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "duckfeed", "index.html"));
});

module.exports = app;

