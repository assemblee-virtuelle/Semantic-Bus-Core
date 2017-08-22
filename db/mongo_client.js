'use strict';

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

var mongoose = require('mongoose');

<<<<<<< HEAD
var conStr = "mongodb://alex:alexfoot31@ds131362-a0.mlab.com:31362,ds131362-a1.mlab.com:31362/semantic_bus_prod?replicaSet=rs-ds131362";
=======
var conStr = "mongodb://alex:alexfoot31@ds127153.mlab.com:27153/semantic_bus_seed";
>>>>>>> 8eff1e2a3176eb1df350f8bf10892cb4e6e4c530


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