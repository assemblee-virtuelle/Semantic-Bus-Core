'use strict';
module.exports = {
  create: _create,
  get: _get,
  cacheModel: require('../models/cache_model'),
  middle_service_workspace: require('../../../webServices/workspaceComponentPromise'),
  mongoose: require('mongoose')

};

function _create(component, cacheData) {
  return new Promise((resolve, reject) => {
    this.cacheModel.findOneAndUpdate({
      _id: component._id
    }, {
      _id: component._id,
      data: cacheData.data
    }, {
      upsert: true,
      returnNewDocument: true
    }).exec((err, cacheReturn) => {
      if (err) {
        reject(err);
      } else {
        resolve(cacheReturn)
      }
    });
  });
//
// let cacheDTO = new this.cacheModel({
//   _id: component._id,
//   data: cacheData.data
// });
//
// return new Promise(function(resolve, reject) {
//   cacheDTO.save(function(err, cacheReturn) {
//     if (err) {
//       reject(err);
//     } else {
//       resolve(cacheReturn)
//     }
//   });
// });
} // <= _create


function _get(component) {
  return new Promise((resolve, reject) => {
    console.log('cache', component);
    this.cacheModel.findOne({
      _id: component._id
    }).exec(function(err, cacheReturn) {
      if (err) {
        reject(err);
      } else {
        resolve(cacheReturn)
      }
    });
  });
} // <=  get
