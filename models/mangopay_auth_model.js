'use strict';

var mongoose = require('../db/mongo_client');
var Mangopayauthschema = require('../model_schemas/workspace_component_schema');

module.exports = mongoose.model('workspaceComponent', Mangopayauthschema);