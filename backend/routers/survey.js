const express = require('express');
const NodeGeocoder = require('node-geocoder');

const authCheck = require('../middleware/authCheck');
const Survey = require('../models/survey');
const router = express.Router();
const url = "/api/surveys";

require('dotenv').config();

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GOOGLE_API_KEY,
  formatter: null
};

router.post(url, async (req, res, next) => {
  let geocoder = NodeGeocoder(options);
  let result;
  let city = req.body.location.city;
  let country = req.body.location.country;

  try {
    if ('latitude' in req.body.location) {
      result = await geocoder.reverse({lat: req.body.location.latitude, lon: req.body.location.longitude})
      city = result[0].city;
      country = result[0].country;
    }
  }
  catch (e) {
    console.log("error", e)
  }

  let survey = new Survey({
    place: req.body.place.toLowerCase(),
    city: city.toLowerCase(),
    country: country.toLowerCase(),
    foods: req.body.foods,
    ducks: req.body.ducks,
    days: req.body.days
  });
  survey.save().then(() => {
    res.status(201).json({
      message: "Thanks for taking time to do this survey! Your survey has been added successfully."
    })
  }).catch(error => {
    res.status(400).json({
      error
    })
  })
});

router.get(url, authCheck, (req, res, next) => {
  Survey.find()
    .populate({
      path:'foods.food',
      populate: {path: 'category'}
    })
    .then(documents => {
    res.status(200).json({
      count: documents.length,
      surveys: documents
    })
  }).catch(error=>{
    res.status(400).json({
      error
    })
  })
});

router.get(url+"/:criteria", authCheck, (req, res, next) => {
  Survey.find().distinct(req.params.criteria.toLowerCase()).then(list=>{
    res.status(200).json({
      list
    })
  })
});

router.get(url+"/duckcount", authCheck, (req, res, next) => {
  Survey.aggregate([
    { $group: {_id: null, total: {$sum: "$ducks"}}}
  ])
  .then(data=>{
      res.status(200).json({
        count: data[0].total
      })
    },(error)=>{
      res.status(400).json({error})
  })
  .catch(e=>{
    res.status(400).json({e})
  })
});

router.get(url+"/duckcount/city/:name", authCheck, (req, res, next) => {
  Survey.aggregate([
    { $match: {city: req.params.name.toLowerCase()}},
    { $group: {_id: null, total: {$sum: "$ducks"}}}
  ])
    .then(data=>{
      res.status(200).json({
        count: data[0].total
      })
    },(error)=>{
      res.status(400).json({error})
    })
    .catch(e=>{
      res.status(400).json({e})
    })
});

router.get(url+"/duckcount/country/:name", authCheck, (req, res, next) => {
  Survey.aggregate([
    { $match: {country: req.params.name.toLowerCase()}},
    { $group: {_id: null, total: {$sum: "$ducks"}}}
  ])
    .then(data=>{
      res.status(200).json({
        count: data[0].total
      })
    },(error)=>{
      res.status(400).json({error})
    })
    .catch(e=>{
      res.status(400).json({e})
    })
});

router.get(url+"/count/:criteria/:name", authCheck, (req, res, next) => {
  let criteria = req.params.criteria.toLowerCase();

  Survey.find()
    .populate({
      path:'foods.food',
      populate: {path: 'category'}
    })
    .then(data => {
      let count = 0;
      let quantity = 0;
      data.forEach(item => {
        item.foods.forEach(foodItem => {
          let foodName = foodItem.food.name;
          switch (criteria) {
            case 'food':
              if(foodName === req.params.name){
                count += 1;
                quantity += foodItem.quantity;
              }
              break;
            case 'category':
              if(foodItem.food.category.name === req.params.name) {
                count += 1;
                quantity += foodItem.quantity;
              }
              break;
            default:
              count = 0;
          }
        })
      });
      res.status(200).json({
        count,
        quantity
      })
    });
});

router.get(url+"/:location/:name", authCheck, (req, res, next) => {
  Survey.find()
    .populate({
      path:'foods.food',
      populate: {path: 'category'}
    })
    .where(req.params.location.toLowerCase(), req.params.name.toLowerCase()).then(documents => {
    res.status(200).json({
      count: documents.length,
      surveys: documents
    })
  })
});



module.exports = router;
