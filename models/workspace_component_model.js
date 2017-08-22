'use strict';

var mongoose = require('../db/mongo_client');
// var WorkspaceComponentSchema = require('../model_schemas').workspaceComponent;

module.exports = mongoose.model('workspaceComponent', WorkspaceComponentSchema);