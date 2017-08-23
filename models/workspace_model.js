'use strict';
console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX MODEL");
var mongoose = require('../db/mongo_client');
<<<<<<< HEAD
var WorkspaceSchema = require('../model_schemas/workspace_schema');
// var WorkspaceSchema = require('../model_schemas/workspace').workspace;

module.exports = mongoose.model('Workspace', WorkspaceSchema);
=======
var WorkspaceSchema = require('../model_schemas/workspace_component_schema');

module.exports = mongoose.model('workspace', WorkspaceSchema, "workspaces");
>>>>>>> 404a71ba87534c7acd26774cba16cfbd6dc397d7
