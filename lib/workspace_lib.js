'use strict';

var user_lib = require('./user_lib');
var workspace_component_lib = require('./workspace_component_lib');
var workspaceModel = require('../models/workspace_model')
var userModel = require('../models/user_model')
var workspaceComponentModel = require('../models/workspace_component_model')
var middle_service_workspace = require('../../../webServices/workspaceComponentPromise')
var mongoose = require('mongoose')
var sift = require('sift')


// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = {
  create: _create,
  destroy: _destroy,
  update: _update,
  updateSimple: _update_simple,
  getAll: _get_all,
  getWorkspace: _get_workspace,
  //load_all_component: _load_all_component
  // get: _get,
};

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------


function _update_simple(workspaceupdate) {
  return new Promise((resolve, reject) => {
    console.log("update workspace |");
    workspaceModel.findOneAndUpdate({
      _id: workspaceupdate._id
    }, workspaceupdate, {
      upsert: true,
      new: true
    }).exec((err, workspaceUpdate) => {
      if (err) {
        reject(err);
      } else {
        console.log("in resolve")
        resolve(workspaceUpdate)
      }
    });
  });
}

// --------------------------------------------------------------------------------


function _create(userId, workspaceData) {
  var workspace = new workspaceModel({
    name: workspaceData.name,
    description: workspaceData.description,
    components: workspaceData.components[0]
  })

  return new Promise(function(resolve, reject) {
    workspace.save(function(err, work) {
      if (err) {
        throw TypeError(err);
      } else {
        userModel.findByIdAndUpdate({
          _id: userId
        }, {
          $push: {
            workspaces: {
              _id: workspace._id,
              role: "owner"
            }
          }
        }, function(err, user) {
          if (err) throw TypeError(err);
          else resolve(work)
        });
      }
    });
  })
} // <= _create

// --------------------------------------------------------------------------------

function _destroy(userId, workspaceId) {
  console.log("destroy : userid ||", userId, "workspaceId ||", workspaceId)
  return new Promise(function(resolve, reject) {
    userModel.findByIdAndUpdate({
      _id: userId
    }, {
      $pull: {
        workspaces: {
          _id: mongoose.Types.ObjectId(workspaceId)
        }
      }
    }, function(err, user) {
      console.log('workspace USER', user.workspaces.length)
      if (err) throw TypeError(err);
      else {
        workspaceModel.find({
          _id: workspaceId
        }, function(err, workspace) {
          if (err) throw TypeError(err)
          else {
            if (workspace[0]) {
              if (workspace[0].components != undefined || workspace[0].components != null) {
                workspace[0].components.forEach(function(workspaceComp) {
                  console.log("for each workspaceComp ||", workspaceComp)
                  workspaceComponentModel.remove({
                    _id: workspaceComp
                  }).exec(function(err, res) {
                    if (err) throw TypeError(err)
                  })
                })
              }
            }
            workspaceModel.findOneAndRemove({
              _id: workspaceId
            }, function(err) {
              if (err) throw TypeError(err)
              else {
                resolve(workspace)
              }
            });
          }
        })
      }
    });
  })
} // <= _destroy

// --------------------------------------------------------------------------------


function _get_all(userID, role) {
  var workspaces_owner = [];
  return new Promise(function(resolve, reject) {
    user_lib.get({
      _id: userID
    }).then(function(user) {
      if (user.workspaces.length > 0) {
        user.workspaces.forEach(function(workspace) {
          if (workspace.role == role) {
            workspaces_owner.push(workspace._id);
          }
        })
        workspaceModel.find({
            '_id': {
              $in: workspaces_owner
            }
          },
          function(err, workspaces) {
            if (workspaces) {
              resolve(workspaces)
            } else {
              reject(err)
            }
          });
      } else {
        resolve([]);
        //reject(new Error('no user whith id '+userID))
      }
    })

  })
} // <= _get_all_owner


// --------------------------------------------------------------------------------


function _update(workspace) {
  //console.log("WORKSAPCE UPDATE", workspace)
  return new Promise(function(resolve, reject) {
    _update_preprocess(workspace).then(function(preData) {
      //console.log('worksapce before mainProcess update |', preData);
      _update_mainprocess(preData).then(function(data) {
        resolve(data)
      }).catch(e => {
        reject(e);
      });
    }).catch(e => {
      reject(e);
    });
  })
} // <= _update


function _update_mainprocess(preData) {
  //preData.components = preData.components.map(c => c._id);
  console.log('before Update',preData);
  return new Promise(function(resolve, reject) {
    workspaceModel.findOneAndUpdate({
        _id: preData._id
      }, preData, {
        upsert: true,
        new: true
      })
      .populate('components')
      .exec((err, componentUpdated) => {
        if (err) {
          reject(err);
        } else {
          console.log('after Update',componentUpdated);
          resolve(componentUpdated);
        }
      });
  })
} // <= _update_mainprocess


// --------------------------------------------------------------------------------
// secong argument should be remove because it is rationally included in first
function _update_preprocess(workspace) {
  //console.log("_update_preprocess")
  var removeWorkspaceComponent = []
  var workspacesCompstring = []
  return new Promise(function(resolve, reject) {
    // if (newWorkspaceComponentId) {
    //   newWorkspaceComponentId.specificData = newWorkspaceComponentId.specificData || {};
    //   workspace.components.push(newWorkspaceComponentId)
    // }
    //console.log(workspace.components.length)
    if (workspace.components.length > 0) {
      workspaceComponentModel.find({
        workspaceId: workspace._id
      }, function(err, allWorkspaceComponent) {
        if (err) {
          reject(err);
        } else {
          var componentsPrimises = [];

          //repare broken links
          workspace.components.forEach(compSource => {
            compSource.connectionsAfter.forEach(compAfterId => {
              sift({
                _id: compAfterId
              }, workspace.components).forEach(compAfter => {
                let linkVerification = sift({
                  $eq: compSource._id
                }, compAfter.connectionsBefore);
                if (linkVerification.length = 0) {
                  compAfter.connectionsBefore.push(compSource._id);
                }
              })
            })
            compSource.connectionsAfter.forEach(compBeforeId => {
              sift({
                _id: compBeforeId
              }, workspace.components).forEach(compBefore => {
                let linkVerification = sift({
                  $eq: compSource._id
                }, compBefore.connectionsAfter);
                if (linkVerification.length = 0) {
                  compBefore.connectionsAfter.push(compSource._id);
                }
              })
            })
          });

          let componentsPromises = [];

          //update
          componentsPromises = componentsPromises.concat(
            sift({
              _id: {
                $in: allWorkspaceComponent.map(c => {
                  return c._id
                })
              }
            }, workspace.components).map(c => {
              //console.log('update component', c)
              return new Promise((resolve, reject) => {
                workspace_component_lib.update(c).then(newComp => {
                  // for (var key in newComp){
                  //   c[key]=newComp[key];
                  // }
                  resolve(newComp);
                });
              })
            })
          );

          //create
          componentsPromises = componentsPromises.concat(
            sift({
              idString: {
                $eq: undefined
              }
            }, workspace.components.map(c => {
              c.idString = c._id == undefined ? undefined : c._id.toString(); //need because objetId don't exist for sift
              return c;
            })).map(c => {

              return new Promise((resolve, reject) => {
                console.log('CREATE');
                workspace_component_lib.create(c).then(newComp => {
                  // for (var key in newComp){
                  //   c[key]=newComp[key];
                  // }
                  resolve(newComp);
                });
              })
            })
          );

          //remove
          componentsPromises = componentsPromises.concat(
            sift({
              _id: {
                $nin: workspace.components.map(c => {
                  return c._id
                })
              }
            }, allWorkspaceComponent).map(c => {
              return new Promise((resolve, reject) => {
                workspace_component_lib.remove(c).then(() => {
                  resolve();
                });
              });
            })
          );

          Promise.all(componentsPromises).then((components) => {
            workspace.components = sift({
              $ne: undefined
            }, components);
            // console.log('workspace.components',workspace.components);
            resolve(workspace);
          })

        }
      })
    } else {
      resolve(workspace);
    }
  })

} // <= _update_preprocess

function _get_workspace(workspace_id) {
  console.log("=============== getworkspace ===========", workspace_id)
  return new Promise(function(resolve, reject) {
    workspaceModel.findOne({
        _id: workspace_id
      })
      .populate('components')
      .exec(function(err, workspace) {
        //console.log('worspace',workspace);
        if (err) {
          //throw TypeError(err)
          reject(err);
        } else {
          //console.log('befor protection |',workspace.components);
          //protection against broken link and empty specificData : corrupt data
          workspace.components = sift({
            $ne: null
          }, workspace.components).map(c=>{c.specificData=c.specificData||{};return c;});
          //console.log('after protection |',workspace.components);
          // console.log('components', workspace.components);
          userModel.find({
              'workspaces._id': workspace._id
            })
            .exec((err, users) => {
              if (err) {
                reject(err);
              } else {
                //console.log(users)
                workspace.users = users.map(user => {
                  return {
                    email: user.credentials.email,
                    role: sift({
                      _id: workspace._id
                    }, user.workspaces)[0].role
                  }
                })
                console.log('workspace_lib | get_workspace', workspace.users);
                resolve(workspace);
              }
            })
        }

      })
  })
} // <= _get_workspace_component

// function _load_all_component(id) {
//   return new Promise(function(resolve, reject) {
//     workspaceModel.findOne({
//         _id: id
//       })
//       .populate('components')
//       .exec(function(err, workspace) {
//         if (err) {
//           reject(err)
//         } else {
//           if (workspace.components.length > 0) {
//             // console.log(workspace)
//             return new Promise(function(resolve, reject) {
//               workspace.components.forEach(function(component, indexPrimary) {
//                 component.connectionsAfter.forEach(function(connectionAfter, indexSecond) {
//                   console.log("CONNECT AFTER")
//                   workspaceComponentModel.findOne({
//                       _id: connectionAfter
//                     })
//                     .populate('connectionsAfter')
//                     .populate('connectionsBefore')
//                     .exec(function(err, component) {
//                       workspace.components[indexPrimary].connectionsAfter[indexSecond] = component
//                       resolve(workspace)
//                     })
//                 })
//               })
//             }).then(function(workspaceUpdate) {
//               return new Promise(function(resolve, reject) {
//                 workspaceUpdate.components.forEach(function(component, indexPrimary) {
//                   component.connectionsBefore.forEach(function(connectionsBefore, indexSecond) {
//                     console.log("CONNECT BEFORE")
//                     workspaceComponentModel.findOne({
//                         _id: connectionsBefore
//                       })
//                       .populate('connectionsAfter')
//                       .populate('connectionsBefore')
//                       .exec(function(err, component) {
//                         workspaceUpdate.components[indexPrimary].connectionsBefore[indexSecond] = component
//                         resolve(workspaceUpdate)
//                       })
//                   })
//                 })
//               }).then(function(workspaceLasrUpdate) {
//                 resolve(workspaceLasrUpdate)
//               })
//             })
//           } else resolve(workspace)
//         }
//       })
//   })
// } // <= _load_all_component
