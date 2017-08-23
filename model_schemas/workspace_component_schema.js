'use strict';

var mongoose = require('mongoose');

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

var WorkspaceComponentSchema = mongoose.Schema({
    module: String,
    type: String,
    name:String,
    description: String,
    editor: String,
    connectionsAfter: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "workspaceComponent"
    }],
    connectionsBefore: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "workspaceComponent"
    }],
    workspaceId: String,
    specificData: Object
})



// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = WorkspaceComponentSchema;