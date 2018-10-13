'use strict';
////console.log(__filename);
var mongoose = require('../db/mongo_client');
var AuthenticationSchema = require('../model_schemas/auth_schema');

/** @type module:mongoose.Model<AuthenticationDocument> */
module.exports = mongoose.model('authentication', AuthenticationSchema);
