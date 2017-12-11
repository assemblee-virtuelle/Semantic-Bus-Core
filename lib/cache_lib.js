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
      }).exec((err, cacheReturn) => {
        ////console.log("cachreturn", cacheReturn)
        if (err) {
          //console.log(err);
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
      }).exec(function(err, cacheReturn) {
        if (err) {
          reject(err);
        } else {
<<<<<<< HEAD
          // console.log('-------- CACHE LIB GET -------| ',cacheReturn);
=======
          ////console.log('-------- CACHE LIB GET -------| ',cacheReturn);
>>>>>>> e36ff5998f0a5bd620b30051fe218258d86ae5f1
          resolve(cacheReturn)
        }
      });
    });
  }
};
