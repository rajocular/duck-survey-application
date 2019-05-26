const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  place: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  foods: [{
    food: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  ducks: {
    type: Number,
    required: true
  },
  days: [{
    day:{
      type: String,
      required: true
    },
    timings: [{
      timing: {
        type: Date,
        required: true
      }
    }]
  }]
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
