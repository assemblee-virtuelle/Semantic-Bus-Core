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
    }

});
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = HistoriqueEndSchema;
