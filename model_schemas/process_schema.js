'use strict';

var mongoose = require('mongoose');

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------



var ProcessSchema = mongoose.Schema({

  timeStamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  workflowId: {
    type: String,
    required: true
  },
  roundDate: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  },
  callerId: {
    type: String,
    //required: true
  },
  originComponentId:{
    type: String,
    required: true
  }
});
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = ProcessSchema;
