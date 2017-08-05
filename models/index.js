'use strict';

var authentication = require('./auth_model');
var user = require('./user_model');
var workspace = require('./workspace_model')
var workspaceComponent = require('./workspace_component_model')

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = {
    authentication: authentication,
    user: user,
    workspace: workspace,
    workspaceComponent: workspaceComponent
}