'use strict';
////console.log(__filename);
var mongoose = require('../db/mongo_client');
var userSchema = require('../model_schemas/user_schema');

/** @type module:mongoose.Model<UserDocument> */
module.exports = mongoose.model('User', userSchema);
