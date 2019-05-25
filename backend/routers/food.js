const express = require('express');
const authCheck = require('../middleware/authCheck');

const Food = require('../models/food');
const router = express.Router();
const url = "/api/foods";

router.get(url, (req, res, next) => {
  Food.find().then(documents => {
    res.status(200).json({
      foods: documents
    })
  }).catch(error => {
    res.status(400).json({
      error
    })
  })
});

router.post(url, authCheck, (req, res, next) => {
  const food = new Food({
    name: req.body.name,
    category: req.body.category
  });

  food.save().then(newFood => {
    res.status(201).json({
      food: newFood
    })
  }).catch(error => {
    res.status(400).json({
      error
    })
  })
});

router.put(url+"/:id", authCheck, (req, res, next) => {
  const food = new Food({
    _id: req.params.id,
    name: req.body.name,
    category: req.body.category
  });

  Food.updateOne(food).then(food =>{
    res.status(200).json({
      food
    })
  }).catch( error =>{
    res.status(400).json({
      error
    })
  })
});

router.delete(url+"/:id", authCheck, (req, res, next) =>{
  Food.deleteOne({_id: req.params.id}).then(() => {
    res.status(200).json({message: 'Food deleted successfully!'});
  });
});

module.exports = router;
