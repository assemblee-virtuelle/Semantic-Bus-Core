'use strict';

var user_lib = require('./user_lib');
var workspaceModel = require('../models').workspace
var userModel = require('../models').user
var workspaceComponentModel = require('../models').workspaceComponent
var middle_service_workspace = require('../../../webServices/workspaceComponentPromise')
var mongoose = require('mongoose')


// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = {
  create: _create,
  destroy: _destroy,
  update: _update,
  getAll: _get_all,
  getWorkspace: _get_workspace_component,
  load_all_component: _load_all_component
  // get: _get,
};

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------


function _create(userId, workspaceData) {
  var workspace = new workspaceModel({
    name: workspaceData.name,
    description: workspaceData.description,
    components: workspaceData.components[0]
  })

  return new Promise(function (resolve, reject) {
    workspace.save(function (err, work) {
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
        }, function (err, user) {
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
  return new Promise(function (resolve, reject) {
    userModel.findByIdAndUpdate({
      _id: userId
    }, {
      $pull: {
        workspaces: {
          _id: mongoose.Types.ObjectId(workspaceId)
        }
      }
    }, function (err, user) {
      console.log('workspace USER', user.workspaces.length)
      if (err) throw TypeError(err);
      else {
        workspaceModel.find({
          _id: workspaceId
        }, function (err, workspace) {
          if (err) throw TypeError(err)
          else {
            if (workspace[0]) {
              if (workspace[0].components != undefined || workspace[0].components != null) {
                workspace[0].components.forEach(function (workspaceComp) {
                  console.log("for each workspaceComp ||", workspaceComp)
                  workspaceComponentModel.remove({
                    _id: workspaceComp
                  }).exec(function (err, res) {
                    if (err) throw TypeError(err)
                  })
                })
              }
            }
            workspaceModel.findOneAndRemove({
              _id: workspaceId
            }, function (err) {
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
  return new Promise(function (resolve, reject) {
    user_lib.get({
      _id: userID
    }).then(function (user) {
      if (user.workspaces.length > 0) {
        user.workspaces.forEach(function (workspace) {
          if (workspace.role == role) {
            workspaces_owner.push(workspace._id);
<<<<<<< HEAD
            console.log(workspaces_owner)
=======
>>>>>>> 8eff1e2a3176eb1df350f8bf10892cb4e6e4c530
          }
        })
        workspaceModel.find({
            '_id': {
              $in: workspaces_owner
            }
          },
          function (err, workspaces) {
<<<<<<< HEAD
            console.log(workspaces)
=======
>>>>>>> 8eff1e2a3176eb1df350f8bf10892cb4e6e4c530
            if (workspaces) {
              resolve(workspaces)
            } else {
              reject(err)
            }
          });
      } else {
        reject("no")
      }
    })

  })
} // <= _get_all_owner


// --------------------------------------------------------------------------------


function _update(workspace, newWorkspaceComponentId) {
  console.log("WORKSAPCE UPDATE", workspace)
  return new Promise(function (resolve, reject) {
    _update_preprocess(workspace, newWorkspaceComponentId).then(function (preData) {
      _update_mainprocess(preData).then(function (user) {
        resolve(user)
      })
    })
  })
} // <= _update


function _update_mainprocess(preData) {
  var toUpdate = {};
  return new Promise(function (resolve, reject) {
    if (preData.name) {
      if (!toUpdate['$set']) {
        toUpdate['$set'] = {};
      }

      toUpdate['$set']['name'] = preData.name;
    }

    if (preData.description) {
      if (!toUpdate['$set']) {
        toUpdate['$set'] = {};
      }

      toUpdate['$set']['description'] = preData.description;
    }

    if (Array.isArray(preData.components)) {
      if (!toUpdate['$set']) {
        toUpdate['$set'] = {};
      }
      toUpdate['$set']['components'] = preData.components;
    }
    console.log("main", toUpdate)
    workspaceModel.findByIdAndUpdate(preData._id, toUpdate, {
      new: true
    }, function (err, userData) {
      if (err) {
        reject(err)
      } else {
        resolve(userData)
      }
    });
  })
} // <= _update_mainprocess


// --------------------------------------------------------------------------------

function _update_preprocess(workspace, newWorkspaceComponentId) {
  console.log("_update_preprocess")
  var removeWorkspaceComponent = []
  var workspacesCompstring = []
  return new Promise(function (resolve, reject) {
    if (newWorkspaceComponentId) {
      workspace.components.push(newWorkspaceComponentId)
    }
    console.log(workspace.components.length)
    if (workspace.components.length > 0) {
      workspaceComponentModel.find({
        workspaceId: workspace._id
      }, function (err, allWorkspaceComponent) {
        if (err) throw TypeError(err)
        else {
          return new Promise(function (resolve, reject) {
            workspace.components.forEach(function (workspaceObjectid) {
              workspacesCompstring.push(workspaceObjectid.toString())
            })
            allWorkspaceComponent.forEach(function (workspaceComp) {
              console.log("INDEX||", workspacesCompstring.indexOf(workspaceComp._id.toString()))
              if (workspacesCompstring.indexOf(workspaceComp._id.toString()) == -1) {
                removeWorkspaceComponent.push(workspaceComp._id)
              }
            })
            resolve(removeWorkspaceComponent)
          }).then(function (removeWorkspaceComponent) {
            workspaceComponentModel.remove({
              _id: {
                $in: removeWorkspaceComponent.map(function (o) {
                  return mongoose.Types.ObjectId(o);
                })
              }
            }, function (err) {
              console.log("preprocess close", workspace)
              if (err) throw TypeError(err)
              resolve(workspace);
            })
          })
        }
      })
    } else {
      resolve(workspace);
    }
  })

} // <= _update_preprocess

function _get_workspace_component(workspace_id) {
  return new Promise(function (resolve, reject) {
    workspaceModel.findOne({
        _id: workspace_id
      })
      .populate('components')
      .exec(function (err, workspa) {
        if (err) throw TypeError(err)
        resolve(workspa);
      })
  })
} // <= _get_workspace_component


function _load_all_component(id) {
  return new Promise(function (resolve, reject) {
    workspaceModel.findOne({
        _id: id
      })
      .populate('components')
      .exec(function (err, workspace) {
        if (err) {reject(err)} else {
        if(workspace.components.length > 0){
          // console.log(workspace)
          return new Promise(function (resolve, reject) {
            workspace.components.forEach(function (component, indexPrimary) {
              component.connectionsAfter.forEach(function (connectionAfter, indexSecond) {
                console.log("CONNECT AFTER")
                workspaceComponentModel.findOne({
                    _id: connectionAfter
                  })
                  .populate('connectionsAfter')
                  .populate('connectionsBefore')
                  .exec(function (err, component) {
                    workspace.components[indexPrimary].connectionsAfter[indexSecond] = component
                    resolve(workspace)
                  })
              })
            })
          }).then(function (workspaceUpdate) {
            return new Promise(function (resolve, reject) {
              workspaceUpdate.components.forEach(function (component, indexPrimary) {
                component.connectionsBefore.forEach(function (connectionsBefore, indexSecond) {
                  console.log("CONNECT BEFORE")
                  workspaceComponentModel.findOne({
                      _id: connectionsBefore
                    })
                    .populate('connectionsAfter')
                    .populate('connectionsBefore')
                    .exec(function (err, component) {
                      workspaceUpdate.components[indexPrimary].connectionsBefore[indexSecond] = component
                      resolve(workspaceUpdate)
                    })
                })
              })
            }).then(function (workspaceLasrUpdate) {
              resolve(workspaceLasrUpdate)
            })
          })
        }else resolve(workspace)
        }
      })
  })
} // <= _load_all_component