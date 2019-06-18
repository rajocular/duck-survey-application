const express = require('express');
const authCheck = require('../middleware/authCheck');

const Food = require('../models/food');
const Survey = require('../models/survey');
const router = express.Router();

router.get("", (req, res, next) => {
  Food.find().populate('category').sort('name').then(documents => {
    res.status(200).json({
      foods: documents
    })
  }).catch(error => {
    res.status(400).json({
      error
    })
  })
});

router.get("/:id", (req, res, next) => {
  Food.find({category: req.params.id}).populate('category').then(documents => {
    res.status(200).json({
      foods: documents
    })
  }).catch(error => {
    res.status(400).json({
      error
    })
  })
});

router.post("", authCheck, (req, res, next) => {
  const food = new Food({
    name: req.body.name.toLowerCase(),
    category: req.body.category._id
  });
  food.save().then(newFood => {
    res.status(201).json({
      food: Object.assign({}, {
        _id: newFood._id,
        name: newFood.name,
        category: req.body.category
      })
    })
  }).catch(error => {
    res.status(400).json({
      error
    })
  })
});

router.put("/:id", authCheck, (req, res, next) => {
  const food = new Food({
    _id: req.params.id,
    name: req.body.name.toLowerCase(),
    category: req.body.category
  });

  Food.updateOne({_id: req.params.id}, food).then(food =>{
    res.status(200).json({
      food
    })
  }).catch( error =>{
    res.status(400).json({
      error
    })
  })
});

router.delete("/:id", authCheck, (req, res, next) =>{
  Food.deleteOne({_id: req.params.id}).then(() => {
    res.status(200).json({message: 'Food deleted successfully!'});
  });
});

module.exports = router;
