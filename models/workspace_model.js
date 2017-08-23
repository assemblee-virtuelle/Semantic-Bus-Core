'use strict';
var mongoose = require('../db/mongo_client');
<<<<<<< HEAD
var WorkspaceSchema = require('../model_schemas').workspace;

module.exports = mongoose.model('workspace', WorkspaceSchema);
=======
var WorkspaceSchema = require('../model_schemas/workspace_schema');
// var WorkspaceSchema = require('../model_schemas/workspace').workspace;

module.exports = mongoose.model('workspace', WorkspaceSchema);
>>>>>>> c3b80765e8ce60af46d326b549581e30bb0b3a8c
