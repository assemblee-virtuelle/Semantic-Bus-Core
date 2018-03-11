'use strict';
////console.log(__filename);
var authentication = require('./auth_model');
var user = require('./user_model');
var workspace = require('./workspace_model');
var workspaceComponent = require('./workspace_component_model');
var cache = require('./cache_model');
var error = require('./error_model')
var historique = require('./historique_model')

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = {
    authentication: authentication,
    user: user,
    workspace: workspace,
    workspaceComponent: workspaceComponent,
    cache: cache,
    error: error,
    historique: historique
}
