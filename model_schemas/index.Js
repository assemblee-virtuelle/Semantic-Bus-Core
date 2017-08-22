'use strict';

var authentication = require('./auth_schema');
var user = require('./user_schema');
var workspace = require('./workspace_schema');
var workspaceComponent = require('./workspace_component_schema')
var transaction  = require('./transaction_schema')
var mangoPayAuthSchema = require('./mangopay_auth_schema')
var cache  = require('./cache_schema')
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = {
    authentication: authentication,
    user: user,
    workspace: workspace,
    workspaceComponent: workspaceComponent,
    transaction: transaction,
    mangoPayAuthSchema: mangoPayAuthSchema,
    cache: cache
}