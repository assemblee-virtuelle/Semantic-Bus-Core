'use strict';
var workspaceComponentModel = require('../models/workspace_component_model');
var config = require('../../../configuration.js');
//var workspaceBusiness = require('../../../webServices/workspaceBusiness')

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = {
  create: _create,
  get: _get,
  update: _update,
  getConnectBeforeConnectAfter: _get_connectBefore_connectAfter,
  get_all: _get_all,
  remove: _remove
};

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------


function _create(workspaceComponents) {
  return new Promise(function(resolve, reject) {
    var componentArray = workspaceComponents
    if (Array.isArray(workspaceComponents) == false) {
      componentArray = []
      componentArray.push(workspaceComponents)
    }
    componentArray.forEach(function(element) {
      var newWorkspaceComponent = new workspaceComponentModel({
        module: element.module,
        type: element.type,
        description: element.description,
        name: element.name,
        editor: element.editor,
        connectionsAfter: element.connectionsAfter,
        connectionsBefore: element.connectionsBefore,
        workspaceId: element.workspaceId,
        specificData: element.specificData
      })

      newWorkspaceComponent.save(function(err, work) {
        if (err) {
          reject(err);
        } else {
          ////console.log('create component |',work);
          resolve(work);
        }
      })
    });
  })
}

// --------------------------------------------------------------------------------


function _get(filter) {
  return new Promise(function(resolve, reject) {
    workspaceComponentModel.findOne(filter)
      .exec(function(err, worksapceComponent) {
        ////console.log("GET comp |",err);
        if (err) {
          reject(err)
        } else if (worksapceComponent == null) {
          resolve(undefined);
        } else {
          worksapceComponent.specificData = worksapceComponent.specificData || {}; //protection against empty specificData : corrupt data
          resolve(worksapceComponent);
        }
      });
  })
} // <= _get

// --------------------------------------------------------------------------------


function _get_all(filter) {
  return new Promise(function(resolve, reject) {
    workspaceComponentModel.find(filter)
      .exec(function(err, worksapceComponents) {
        if (err) {
          reject(err)
        } else {
          worksapceComponents.forEach(c => {
            c.specificData = c.specificData || {}
          }); //protection against empty specificData : corrupt data


          resolve(worksapceComponents);
        }
      });
  })
} // <= _get_all


// --------------------------------------------------------------------------------



function _get_connectBefore_connectAfter(filter) {
  return new Promise(function(resolve, reject) {
    workspaceComponentModel.findOne(filter)
      .populate('connectionsBefore')
      .populate('connectionsAfter')
      .exec(function(err, worksapceComponent) {
        if (err) {
          reject(err)
        } else {
          worksapceComponent.specificData = worksapceComponent.specificData || {};
          ////console.log("connectionBefore", worksapceComponent)
          resolve(worksapceComponent);
        }
      });
  })
} // <= _get_connectBefore_connectAfter

// --------------------------------------------------------------------------------

function _update(componentToUpdate) {
  ////console.log('ALLLO',componentToUpdate);
  return new Promise((resolve, reject) => {
    if (config.quietLog != true) {
      ////console.log("update component");
    }
    try {
      //      resolve(componentToUpdate);
      workspaceComponentModel.findOneAndUpdate({
        _id: componentToUpdate._id
      }, componentToUpdate, {
        upsert: true,
        new: true
      }).exec((err, componentUpdated) => {
        if (err) {
          if (config.quietLog != true) {
            ////console.log("update component failed");
          }
          reject(err);
        } else {
          if (config.quietLog != true) {
            ////console.log("update component done");
          }
          ////console.log("in resolve")
          resolve(componentUpdated)
        }
      });
    } catch (e) {
      if (config.quietLog != true) {
        ////console.log('EXCEPTION');
      }
    }
  });

  //
  //
  // //console.log("update component |", componentToUpdate);
  // return new Promise(function (resolve, reject) {
  //   workspaceComponentModel.findOne({
  //       _id: componentToUpdate._id
  //     })
  //     .exec(function (err, worksapceComponent) {
  //       if (err) {} else {
  //         return new Promise(function (resolve, reject) {
  //           if (componentToUpdate.connectionsAfter) {
  //             componentToUpdate.connectionsAfter.forEach(function (connectionsAfter) {
  //               if (connectionsAfter) {
  //                 if (worksapceComponent.connectionsAfter.indexOf(connectionsAfter._id.toString()) == -1) {
  //                   worksapceComponent.connectionsAfter.push(connectionsAfter._id)
  //                 }
  //               }
  //             })
  //           }
  //           if (componentToUpdate.connectionsBefore) {
  //             componentToUpdate.connectionsBefore.forEach(function (connectionsBefore) {
  //               if (connectionsBefore) {
  //                 if (worksapceComponent.connectionsBefore.indexOf(connectionsBefore._id.toString()) == -1) {
  //                   worksapceComponent.connectionsBefore.push(connectionsBefore._id)
  //                 }
  //               }
  //             })
  //           }
  //           if (componentToUpdate.specificData != null) {
  //             worksapceComponent.specificData = componentToUpdate.specificData
  //           }
  //
  //           resolve(worksapceComponent)
  //           //console.log("BEFORE SAVE", worksapceComponent)
  //         }).then(function (worksapceCompone) {
  //           worksapceComponent.save(function (err, worksapceComponent) {
  //             if (err) return handleError(err);
  //             workspaceComponentModel.findOne({
  //                 _id: worksapceComponent._id
  //               })
  //               .populate('connectionsAfter')
  //               .populate('connectionsBefore')
  //               .exec(function (err, component) {
  //                 //console.log("EXEC DONE", component)
  //                 if (err) throw TypeError(err)
  //                 component.connectionsAfter.forEach(function (connectionAfter) {
  //                   //console.log("CONNECT AFTER", connectionAfter)
  //                   if (connectionAfter.connectionsBefore == null) {
  //                     connectionAfter.connectionsBefore = []
  //                   }
  //                   if (connectionAfter.connectionsBefore.indexOf(worksapceComponent._id.toString()) == -1) {
  //                     connectionAfter.connectionsBefore.push(worksapceComponent._id)
  //                     connectionAfter.save(function (err, worksapce) {
  //                       if (err) return handleError(err);
  //                     })
  //                   }
  //                 })
  //                 component.connectionsBefore.forEach(function (connectionBefore) {
  //                   //console.log('CONNECT BEFORE', connectionBefore)
  //                   if (connectionBefore.connectionsAfter == null) {
  //                     connectionBefore.connectionsAfter = []
  //                   }
  //                   if (connectionBefore.connectionsAfter.indexOf(worksapceComponent._id.toString()) == -1) {
  //                     connectionBefore.connectionsAfter.push(worksapceComponent._id)
  //                     connectionBefore.save(function (err, worksapceComponent) {
  //                       if (err) return handleError(err);
  //                     })
  //                   }
  //                 })
  //                 //console.log("FINAL SAVE", worksapceComponent)
  //                 resolve(component)
  //               })
  //           })
  //         })
  //       }
  //     })
  // });
} // <= _update

function _remove(componentToDelete) {
  return new Promise((resolve, reject) => {
    workspaceComponentModel.remove({
      _id: componentToDelete._id
    }).exec(function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res);
      }
    })
  });
} // <= remove
