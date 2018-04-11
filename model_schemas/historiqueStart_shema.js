'use strict';

var mongoose = require('mongoose');

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------



var HistoriqueStartSchema = mongoose.Schema({
  processId: {
    type: String,
    //required: true
  },
  moPrice: {
    type: Number
  },
  // workflowId:{
  //     type: String,
  //     required: true
  // },
  // workspaceName:{
  //     type: String,
  // },
  componentName: {
    type: String,
  },
  componentPrice: {
    type: Number,
    default: null
  },
  componentModule: {
    type: String,
    default: "module"
  },
  moCount: {
    type: Number
  },
  // workspaceId: {
  //     type: String,
  //     required: true
  // },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  // roundDate: {
  //     type: String,
  //     required: true
  // },
  componentId: {
    type: String,
    required: true
  },
  recordCount: {
    type: Number,
    default: 0,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  recordPrice: {
    type: Number,
    required: true
  },

});
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = HistoriqueStartSchema;
