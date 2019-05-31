const mongoose = require("mongoose");
require('dotenv').config();

const database = process.env.MONGODB_URI;

mongoose
  .connect(
    database,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });
