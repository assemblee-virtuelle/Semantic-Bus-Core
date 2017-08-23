'use strict';

var mongoose = require('../db/mongo_client');
<<<<<<< HEAD
var Mangopayauthschema = require('../model_schemas').mangoPayAuthSchema;
=======
var Mangopayauthschema = require('../model_schemas/mangopay_auth_schema');
>>>>>>> c3b80765e8ce60af46d326b549581e30bb0b3a8c

module.exports = mongoose.model('Mangopayauthschema', Mangopayauthschema);
