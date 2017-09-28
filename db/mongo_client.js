'use strict';
var config2 = require('../../../configuration.js');
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

var mongoose = require('mongoose');

var conStr = config2.mlabDB;
//console.log('config | ',config2);

mongoose.connect(conStr);

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
