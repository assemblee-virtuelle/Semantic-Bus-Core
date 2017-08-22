'use strict';

var mongoose = require('../db/mongo_client');
var transactionSchema = require('../model_schemas').transaction;

module.exports = mongoose.model('transaction', transactionSchema);