'use strict';
var mongoose = require('mongoose');
// var workspaceComponent = require('./workspace_component_schema')

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

var WorkspaceSchema = mongoose.Schema({
    name: String,
    description: String,
    components: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "workspaceComponent"
    }],
    dates: {
        created_at: Date
    },
    flow_size: {
        type: Number,
        default: 0
    },
    average_consumption: {
        type: Number,
        default: 0
    },
    users: [{
        email: String,
        role: String,
    }]
});


// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = WorkspaceSchema;
