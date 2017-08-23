'use strict';

var mongoose = require('../db/mongo_client');
var WorkspaceSchema = require('../model_schemas/workspace_component_schema');
// var WorkspaceSchema = require('../model_schemas/workspace').workspace;

module.exports = mongoose.model('Workspace', WorkspaceSchema);