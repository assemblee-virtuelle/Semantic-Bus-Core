'use strict';
module.exports = {
  fragmentModel: require('../models/fragment_model'),
  PromiseOrchestrator: require('../helpers/promiseOrchestrator.js'),
  //promiseOrchestrator : new PromiseOrchestrator();
  objectSizeOf: require("object-sizeof"),


  //mongoose: require('mongoose'),
  frag: function(data, key) {
    //console.log('XXXXXXX',data);
    //remove all dependent fragments
    return new Promise((resolve, reject) => {
      //if(data instanceof Object){
      if (Array.isArray(data)) {

        if (this.objectSizeOf(data) > 1000) {
          // console.log('ARRAY BIG', key);
          let promiseOrchestrator = new this.PromiseOrchestrator();

          promiseOrchestrator.execute(this, this.persist, data.map(r => [{
            data: r
          }]), {}).then(persistRecords => {
            let arrayOut = [];
            let allFrags = [];
            persistRecords.forEach(persistRecord => {
              if (persistRecord._id != undefined) {
                //console.log("_id",persistRecord._id);
                arrayOut.push({
                  _frag: persistRecord._id
                });
                allFrags = allFrags.concat([persistRecord._id]);
              } else {
                arrayOut.push(persistRecord);
              }
              if (persistRecord.frags != undefined) {
                allFrags = allFrags.concat(persistRecord.frags);
              }
            });
            //console.log('ALLO?');
            resolve({
              data: arrayOut,
              frags: allFrags,
              key: key
            });
          })
        } else {
          // console.log('ARRAY SMALL', key);
          //console.log('NO PERSIST');
          resolve({
            data: data,
            frags: [],
            key: key
          });
        }
      } else if (data instanceof Object && key != '_id' && key != '_frag') {
        // console.log('OBJECT', key);
        let promiseStack = [];
        let objectOut = {};
        for (let key in data) {
          //console.log('frag key', key);
          promiseStack.push(this.frag(data[key], key));
        }
        // let persistValuesPromises = data.map((key, val) => {
        //   return this.frag(data[key], key);
        // });

        Promise.all(promiseStack).then(frags => {
          let allFrags = [];
          //let out={data:data};
          frags.forEach(frag => {
            objectOut[frag.key] = frag.data;
            if (frag.frags != undefined) {
              allFrags = allFrags.concat(frag.frags);
            }
          });
          //out.frags = allFrags;
          resolve({
            data: objectOut,
            frags: allFrags,
            key: key
          });
        });
      } else {
        // console.log('PRIMITIV', key);
        resolve({
          data: data,
          key: key
        });
      }


      // if (Array.isArray(data[key])) {
      //   data[key].forEach(record => {
      //     this.persist(record).then(fragment => {
      //       fragment
      //     });
      //   })
      // }
    })
  },
  persist: function(data) {
    //console.log('persist data frag', this.objectSizeOf(data));
    //console.log('persist data frag',data);
    if (data instanceof Object) {
      return new Promise((resolve, reject) => {
        //remove all dependent fragments
        this.fragmentModel.findOne({
          _id: data._id
        }).lean().exec().then(fragment => {
          //console.log('finded fragment');
          if (fragment != null) {
            //console.log('EXISTING frag',fragment.frags);
            this.fragmentModel.remove({
              _id: {
                $in: fragment.frags
              }
            }).exec();
          }
          this.frag(data.data).then(frag => {
            //console.log('fragmentation done');
            if (fragment == null) {
              fragment = new this.fragmentModel(frag);
              fragment._id = data._id;
            } else {
              fragment.data = frag.data;
              fragment.frags = frag.frags;
            }
            this.fragmentModel.findOneAndUpdate({
              _id: fragment._id
            }, fragment, {
              upsert: true,
              new: true
            }).lean().exec((err, newdata) => {
              if (err != null) {
                console.log('frag error', err);
              }
              //console.log('newdata', newdata._id);
              // // console.log(err);
              resolve(newdata);
            });
          })
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(data);
      })
    }
  },
  get: function(id) {
    console.log(" ------ in fragment component ------ ", id)
    return new Promise((resolve, reject) => {
      //console.log('cache', component);
      this.fragmentModel.findOne({
        _id: id
      }).lean().exec().then((fragmentReturn) => {
        //console.log('-------- FAGMENT LIB GET -------| ', fragmentReturn);
        resolve(fragmentReturn)
      }).catch(err => {
        console.log('-------- FAGMENT LIB ERROR -------| ', err);
        reject(err);
      });
    });
  },
  getWithResolution: function(id) {
    console.log(" ------ in fragment component ------ ", id)
    return new Promise((resolve, reject) => {
      //console.log('cache', component);
      this.fragmentModel.findOne({
        _id: id
      }).lean().exec().then((fragmentReturn) => {
        this.fragmentModel.find({
          _id: {
            $in: fragmentReturn.frags
          }
        }).lean().exec().then(framentParts => {
          let partDirectory = {}
          let partBinding = framentParts.forEach(frag => {
            partDirectory[frag._id] = frag.data;
          });
          //console.log(partDirectory);
          resolve(this.rebuildFrag(fragmentReturn, partDirectory));
        }).catch(e => {
          reject(e);
        });
      }).catch(err => {
        reject(err);
        console.log('-------- FAGMENT LIB ERROR -------| ', err);
      });
    });
  },
  rebuildFrag: function(object, partDirectory) {
    if (object instanceof Object) {
      for (let key in object) {
        //console.log(key);
        if (key != '_id') {
          if (object[key]['_frag'] != undefined) {
            //console.log('ALLO');
            object[key] = this.rebuildFrag(partDirectory[object[key]['_frag']], partDirectory);
          } else {
            object[key] = this.rebuildFrag(object[key], partDirectory);
          }
        }
      }
    }
    return object;
  },
  cleanFrag: function(id) {
    console.log('cleanFrag', id);
    this.fragmentModel.findOne({
      _id: id
    }).lean().exec().then(frag => {
      //console.log(frag);
      if (frag != null) {
        let fragsToDelete = frag.frags;
        fragsToDelete.push(frag._id);
        this.fragmentModel.remove({
          _id: {
            $in: fragsToDelete
          }
        }).exec();
      }
    })
  }

};
