'use strict';

var mongoose = require('../db/mongo_client');
var Mangopayauthschema = require('../model_schemas/mangopay_auth_schema');

module.exports = mongoose.model('Mangopayauthschema', Mangopayauthschema);
