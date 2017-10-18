'use strict';
module.exports = {
  errorModel: require('../models/error_model'),
  mongoose: require('mongoose'),
  errorParser: require('error-stack-parser'),
  create: function(error) {
    console.log('ERROR LIB CREATE | ', error);
    return new Promise((resolve, reject) => {
      this.errorModel.create({
          stackArray: this.errorParser.parse(error),
          message:error.message
        },
        function(err, error) {
          if (err) {
            reject(err);
          }
        }
      );
    });
  },
  getAll: function(component) {

    return new Promise((resolve, reject) => {
      this.errorModel.find({}).sort({date:-1}).exec(function(err, errors) {
          if (err) {
            reject(err);
          }else{
            resolve(errors);
          }
      });
    });
  }
};
