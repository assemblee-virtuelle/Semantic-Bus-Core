'use strict';
module.exports = {
  cacheModel: require('../models/cache_model'),
  middle_service_workspace: require('../../../webServices/workspaceComponentPromise'),
  mongoose: require('mongoose'),
  persist: function(component, cachedData) {
    //console.log('CACHE LIB CREATE | ',cachedData);
    return new Promise((resolve, reject) => {
      this.cacheModel.findOneAndUpdate({
        _id: component._id
      },
        cachedData
      , {
        upsert: true,
        new: true
      }).lean().exec((err, cacheReturn) => {
        //console.log("cachreturn", cacheReturn)
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(cacheReturn)
        }
      });
    });
  },
  get: function(component) {
    ////console.log(" ------ in cache component ------ ", component._id)
    return new Promise((resolve, reject) => {
      ////console.log('cache', component);
      this.cacheModel.findOne({
        _id: component._id
      }).lean().exec(function(err, cacheReturn) {
        if (err) {
          reject(err);
        } else {
          // console.log('-------- CACHE LIB GET -------| ',cacheReturn);
          resolve(cacheReturn)
        }
      });
    });
  }
};
