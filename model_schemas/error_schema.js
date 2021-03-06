'use strict';

var mongoose = require('mongoose');

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

var ErrorSchema = mongoose.Schema({
  stack: {
    type: String
  },
  message:{
    type: String,
    required: true
  },
  userId:{
    type: String
  },
  stackArray: [{
    type: String,
    required: true
  }],
  date: {
    type: Date,
    required: true,
    default: Date.now,
  }
});



// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = ErrorSchema;
