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

app.use(userRouter);
app.use(surveyRouter);
app.use(categoryRouter);
app.use(foodRouter);

module.exports = app;

