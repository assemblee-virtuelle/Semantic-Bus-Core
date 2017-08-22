'use strict';

var authentication = require('./auth_model');
var user = require('./user_model');
var workspace = require('./workspace_model')
var workspaceComponent = require('./workspace_component_model')
<<<<<<< HEAD
var cache = require('./cache_model')
=======
>>>>>>> 8eff1e2a3176eb1df350f8bf10892cb4e6e4c530

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = {
    authentication: authentication,
    user: user,
    workspace: workspace,
<<<<<<< HEAD
    workspaceComponent: workspaceComponent,
    cache: cache
=======
    workspaceComponent: workspaceComponent
>>>>>>> 8eff1e2a3176eb1df350f8bf10892cb4e6e4c530
}