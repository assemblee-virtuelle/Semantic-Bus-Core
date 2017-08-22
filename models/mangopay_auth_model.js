'use strict';

var mongoose = require('../db/mongo_client');
// var Mangopayauthschema = require('../model_schemas').mangoPayAuthSchema;

module.exports = mongoose.model('workspaceComponent', Mangopayauthschema);