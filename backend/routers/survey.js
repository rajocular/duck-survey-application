const express = require('express');
const authCheck = require('../middleware/authCheck');

const Survey = require('../models/survey');
const router = express.Router();
const url = "/api/surveys";

router.get(url, authCheck, (req, res, next) => {
  Survey.find().then(documents => {
    res.status(200).json({
      surveys: documents
    })
  }).catch(error=>{
    res.status(400).json({
      error
    })
  })
});

router.post(url, (req, res, next) => {
  const survey = new Survey({
    place: req.body.place,
    city: req.body.city,
    province: req.body.province,
    country: req.body.country,
    foods: req.body.foods,
    ducks: req.body.ducks,
    days: req.body.days
  });

  survey.save().then(newSurvey => {
    res.status(201).json({
      survey: newSurvey
    })
  }).catch(error=>{
    res.status(400).json({
      error
    })
  })
});

module.exports = router;
