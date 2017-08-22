'use strict';

var mongoose = require('../db/mongo_client');
var userSchema = require('../model_schemas/user_schema');

module.exports = mongoose.model('user', userSchema);