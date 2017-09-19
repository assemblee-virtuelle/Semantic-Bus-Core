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
    graphIcon: String,
    graphPositionX:Number,
    graphPositionY:Number,
    connectionsAfter: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "workspaceComponent"
    }],
    connectionsBefore: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "workspaceComponent"
    }],
    workspaceId: String,
    specificData: {
        type: Object,
        default: {}
    },
    consumption_history: [{
        traitement_id: Number,
        dates: {
          created_at: Date
        },
        flow_size: {
          type: Number,
          default: 0
        },
        price:Number
    }],
    pricing: {
        type: Number,
        default: 4
    },
})



// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = WorkspaceComponentSchema;
