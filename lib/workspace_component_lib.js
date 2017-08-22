'use strict';
var workspaceComponentModel = require('../models/workspace_component_model');
var workspaceBusiness = require('../../../webServices/workspaceBusiness')

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = {
  create: _create,
  get: _get,
  update: _update,
  getConnectBeforeConnectAfter: _get_connectBefore_connectAfter,
  get_all: _get_all
};

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------


function _create(workspaceComponents) {
  return new Promise(function (resolve, reject) {
    var componentArray = workspaceComponents
    if (Array.isArray(workspaceComponents) == false) {
      componentArray = []
      componentArray.push(workspaceComponents)
    }
    componentArray.forEach(function (element) {
      var newWorkspaceComponent = new workspaceComponentModel({
        module: element.module,
        type: element.type,
        description: element.description,
        name: element.name,
        editor: element.editor,
        connectionsAfter: element.connectionsAfter,
        connectionsBefore: element.connectionsBefore,
        workspaceId: element.workspaceId
      })

      newWorkspaceComponent.save(function (err, work) {
        if (err) throw TypeError(err)
        else {
          resolve(work)
        }
      })
    });
  })
}

// --------------------------------------------------------------------------------


function _get(filter) {
  return new Promise(function (resolve, reject) {
    workspaceComponentModel.findOne(filter)
      .exec(function (err, worksapceComponent) {
        if (err) {
          reject(err)
        } else {
          resolve(worksapceComponent);
        }
      });
  })
} // <= _get

// --------------------------------------------------------------------------------


function _get_all(filter) {
  return new Promise(function (resolve, reject) {
    workspaceComponentModel.find(filter)
      .exec(function (err, worksapceComponent) {
        if (err) {
          reject(err)
        } else {
          resolve(worksapceComponent);
        }
      });
  })
} // <= _get_all


// --------------------------------------------------------------------------------



function _get_connectBefore_connectAfter(filter) {
  return new Promise(function (resolve, reject) {
    workspaceComponentModel.findOne(filter)
      .populate('connectionsBefore')
      .populate('connectionsAfter')
      .exec(function (err, worksapceComponent) {
        if (err) {
          reject(err)
        } else {
          console.log("connectionBefore", worksapceComponent)
          resolve(worksapceComponent);
        }
      });
  })
} // <= _get_connectBefore_connectAfter

// --------------------------------------------------------------------------------

function _update(id, componentToUpdate) {
  console.log("update component |", componentToUpdate);
  return new Promise(function (resolve, reject) {
    workspaceComponentModel.findOne({
        _id: componentToUpdate._id
      })
      .exec(function (err, worksapceComponent) {
        if (err) {} else {
          return new Promise(function (resolve, reject) {
            if (componentToUpdate.connectionsAfter) {
              componentToUpdate.connectionsAfter.forEach(function (connectionsAfter) {
                if (connectionsAfter) {
                  if (worksapceComponent.connectionsAfter.indexOf(connectionsAfter._id.toString()) == -1) {
                    worksapceComponent.connectionsAfter.push(connectionsAfter._id)
                  }
                }
              })
            }
            if (componentToUpdate.connectionsBefore) {
              componentToUpdate.connectionsBefore.forEach(function (connectionsBefore) {
                if (connectionsBefore) {
                  if (worksapceComponent.connectionsBefore.indexOf(connectionsBefore._id.toString()) == -1) {
                    worksapceComponent.connectionsBefore.push(connectionsBefore._id)
                  }
                }
              })
            }
            if (componentToUpdate.specificData != null) {
              worksapceComponent.specificData = componentToUpdate.specificData
            }

            resolve(worksapceComponent)
            console.log("BEFORE SAVE", worksapceComponent)
          }).then(function (worksapceCompone) {
            worksapceComponent.save(function (err, worksapceComponent) {
              if (err) return handleError(err);
              workspaceComponentModel.findOne({
                  _id: worksapceComponent._id
                })
                .populate('connectionsAfter')
                .populate('connectionsBefore')
                .exec(function (err, component) {
                  console.log("EXEC DONE", component)
                  if (err) throw TypeError(err)
                  component.connectionsAfter.forEach(function (connectionAfter) {
                    console.log("CONNECT AFTER", connectionAfter)
                    if (connectionAfter.connectionsBefore == null) {
                      connectionAfter.connectionsBefore = []
                    }
                    if (connectionAfter.connectionsBefore.indexOf(worksapceComponent._id.toString()) == -1) {
                      connectionAfter.connectionsBefore.push(worksapceComponent._id)
                      connectionAfter.save(function (err, worksapce) {
                        if (err) return handleError(err);
                      })
                    }
                  })
                  component.connectionsBefore.forEach(function (connectionBefore) {
                    console.log('CONNECT BEFORE', connectionBefore)
                    if (connectionBefore.connectionsAfter == null) {
                      connectionBefore.connectionsAfter = []
                    }
                    if (connectionBefore.connectionsAfter.indexOf(worksapceComponent._id.toString()) == -1) {
                      connectionBefore.connectionsAfter.push(worksapceComponent._id)
                      connectionBefore.save(function (err, worksapceComponent) {
                        if (err) return handleError(err);
                      })
                    }
                  })
                  console.log("FINAL SAVE", worksapceComponent)
                  resolve(component)
                })
            })
          })
        }
      })
  });
}; // <= _update


