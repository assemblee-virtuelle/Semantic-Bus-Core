'use strict';

var mongoose = require('mongoose');

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------



var HistoriqueEndSchema = mongoose.Schema({
    timeStamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    processId: {
        type: String,
        //required: true
    },
    componentId: {
        type: String,
        //required: true
    },
    componentName: {
        type: String,
        //required: true
    },
    componentModule: {
        type: String,
        //required: true
    },
    data:{
        type: Object,
        //required: true
    },
    error:{
        type: Object,
        //required: true
    },
    moPrice: {
      type: Number
    },
    componentPrice: {
      type: Number,
    },
    componentModule: {
      type: String,
    },
    moCount: {
      type: Number
    },
    startTime: {
      type: Date,
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
    roundDate: {
      type: String,
      required: true
    }

});
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = HistoriqueEndSchema;
