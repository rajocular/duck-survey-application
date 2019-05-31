const express = require('express');
const authCheck = require('../middleware/authCheck');

const Category = require('../models/category');
const router = express.Router();

router.get("", (req, res, next) => {
  Category.find().sort('name').then(documents => {
    res.status(200).json({
      categories: documents
    })
  }).catch(error => {
    res.status(400).json({
      error
    })
  })
});

router.post("", authCheck, (req, res, next) => {
  const category = new Category({
    name: req.body.name.toLowerCase()
  });

  category.save().then(newCategory => {
    res.status(201).json({
      category: newCategory
    })
  }).catch(error => {
    res.status(400).json({
      error
    })
  })
});

router.put("/:id", authCheck, (req, res, next) => {
  const category = new Category({
    _id: req.params.id,
    name: req.body.name.toLowerCase()
  });

  Category.updateOne(category).then(category =>{
    res.status(200).json({
      category
    })
  }).catch( error =>{
    res.status(400).json({
      error
    })
  })
});

router.delete("/:id", authCheck, (req, res, next) =>{
  Category.deleteOne({_id: req.params.id}).then(() => {
    res.status(200).json({message: 'Category deleted successfully!'});
  });
});

module.exports = router;
