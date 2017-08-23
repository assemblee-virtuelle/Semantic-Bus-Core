'use strict';
console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
var mongoose = require('mongoose');
var workspaceComponent = require('./workspace_component_schema')

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
    }
});


// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = WorkspaceSchema;
