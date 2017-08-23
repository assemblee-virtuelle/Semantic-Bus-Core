'use strict';

var mongoose = require('../db/mongo_client');
var WorkspaceSchema = require('../model_schemas/workspace_component_schema');

module.exports = mongoose.model('workspace', WorkspaceSchema, "workspaces");