'use strict';

var authentication = require('./auth_schema');
var user = require('./user_schema');
var workspace = require('./workspace_schema');
var workspaceComponent = require('./workspace_component_schema')
var transaction  = require('./transaction_schema')
var mangoPayAuthSchema = require('./mangopay_auth_schema')
<<<<<<< HEAD
var cache  = require('./cache_schema')
=======
>>>>>>> 8eff1e2a3176eb1df350f8bf10892cb4e6e4c530
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = {
    authentication: authentication,
    user: user,
    workspace: workspace,
    workspaceComponent: workspaceComponent,
    transaction: transaction,
<<<<<<< HEAD
    mangoPayAuthSchema: mangoPayAuthSchema,
    cache: cache
=======
    mangoPayAuthSchema: mangoPayAuthSchema
>>>>>>> 8eff1e2a3176eb1df350f8bf10892cb4e6e4c530
}