'use strict';
module.exports = {
  cacheModel: require('../models/cache_model'),
  middle_service_workspace: require('../../../webServices/workspaceComponentPromise'),
  mongoose: require('mongoose'),
  create: function(component, cacheData) {
    //console.log('CACHE LIB CREATE | ',cacheData);
    return new Promise((resolve, reject) => {
      this.cacheModel.findOneAndUpdate({
        _id: component._id
      }, {
        _id: component._id,
        data: cacheData.data
      }, {
        upsert: true,
        new: true
      }).exec((err, cacheReturn) => {
        if (err) {
          reject(err);
        } else {
          resolve(cacheReturn)
        }
      });
    });
  },
  get: function(component) {
    return new Promise((resolve, reject) => {
      //console.log('cache', component);
      this.cacheModel.findOne({
        _id: component._id
      }).exec(function(err, cacheReturn) {
        if (err) {
          reject(err);
        } else {
          //console.log('CACHE LIB GET | ',cacheReturn);
          resolve(cacheReturn)
        }
      });
    });
  }
};
