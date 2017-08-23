'use strict';
var config = require('../../../configuration');
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

var mongoose = require('mongoose');

var conStr = config.mlabDB

mongoose.connect(conStr);
console.log("new connection")
var db = mongoose.connection;

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () { 
  console.log('Mongoose default connection open to ' + conStr);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

module.exports = mongoose;