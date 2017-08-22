'use strict';

var mongoose = require('../db/mongo_client');
var CacheSchema = require('../model_schemas').cache;

module.exports = mongoose.model('cache', CacheSchema);