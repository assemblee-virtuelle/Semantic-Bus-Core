'use strict';

var userModel = require('../models/user_model');
var workspaceModel = require('../models/workspace_model');
var pattern = require('../helpers').patterns;
const bcrypt = require('bcryptjs');


// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = {
  create: _create,
  get: _get,
  get_all: _get_all,
  update: _update,
  getWithWorkspace: _getWithWorkspace
};


userModel.on('index', function (err) {
  console.log("INDEX MONGOOSE ERROR ======>", err)
});

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

// create ==  1 + 2
// 1 - edit data encrypt password( send activation mail)
// 2 - save in bdd user model

function _create(bodyParams) {
  return new Promise(function (resolve, reject) {
    _create_preprocess(bodyParams.user).then(function (preData) {
      _create_mainprocess(preData).then(function (user) {
        resolve(user)
      })
    })
  })
} // <= _create

// --------------------------------------------------------------------------------

function _create_mainprocess(preData) {
  var user = new userModel({
    credentials: {
      email: preData.email,
      hashed_password: preData.hashedPassword
    },
    name: preData.name,
    society: preData.society,
    job: preData.job,
    dates: {
      created_at: new Date(),
      updated_at: new Date()
    }
  })

  return new Promise(function (resolve, reject) {
    user.save(function (err, userData) {
      if (err) {
        reject(err);
      } else {
        resolve(userData);
      }
    });
  })
} // <= _create_mainprocess

// --------------------------------------------------------------------------------

function _create_preprocess(userParams) {
  var user_final = {}
  console.log(userParams)
  var email = new Promise(function (resolve, reject) {
    if (!userParams.email) {
      reject("no email provided");
    }

    _check_email(userParams.email).then(function (boolean) {
      console.log("email:", userParams.email, "check email :", boolean)
      if (!boolean) {
        reject("bad_email")
      } else {
        resolve(userParams.email)
      }
    })

  })
  var job = new Promise(function (resolve, reject) {
    if (!userParams.job) {
      resolve(null);
    }
    _check_job(userParams.job).then(function (boolean) {
      console.log("job:", userParams.job, "check job :", boolean)
      if (!boolean) {
        reject("bad_job")
      } else {
        resolve(userParams.job)
      }
    })
  })
  var name = new Promise(function (resolve, reject) {
    if (!userParams.name) {
      resolve(null);
    }
    _check_name(userParams.name).then(function (boolean) {
      console.log("name:", userParams.name, "check name :", boolean)
      if (!boolean) {
        reject("bad_name");
      } else {
        resolve(userParams.name)
      }
    })
  })


  var hash_password = new Promise(function (resolve, reject) {
    _hash_password(userParams.password, userParams.passwordConfirm).then(function (hashedPassword) {
      resolve(hashedPassword)
    })
  })

  var society = new Promise(function (resolve, reject) {
    if (userParams.society) {
      reject(userParams.society)
    } else {
      resolve(null)
    }
  })
  return new Promise(function (resolve, reject) {
    Promise.all([email, name, hash_password, job, society]).then(function (user) {
      user_final['email'] = user[0];
      user_final['name'] = user[1];
      user_final['hashedPassword'] = user[2];
      user_final['job'] = user[3];
      user_final['society'] = user[4];
      resolve(user_final)
    }).catch(function (err) {
      console.log(err)
      reject(err)
    })
  })
} // <= _create_preprocess

// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------

function _get_all(options) {
  console.log("get_all")
  return new Promise(function (resolve, reject) {
    userModel.find(options.filters)
      .limit(options.limit)
      .select(options.select)
      .skip(options.skip)
      .sort(options.sort)
      .exec(function (err, users) {
        if (err) {
          reject(err)
        } else {
          console.log("GET ALL", users)
          resolve(users);
        }
      });
  })
} // <= _get_all



function _get(filter) {
  return new Promise(function (resolve, reject) {
    userModel.findOne(filter)
      .exec(function (err, userData) {
        if (err) {
          reject(err)
        } else {
          resolve(userData);
        }
      });
  })
} // <= _get


function _getWithWorkspace(userID, role) {
  var workspaces_owner = [];
  return new Promise(function(resolve, reject) {
    _get({
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
              resolve({user: user, workspaces: workspaces})
            } else {
              reject(err)
            }
          });
      } else {
        reject("no")
      }
    })

  })
} // <= _getWithWorkspace


function _update(user) {
  return new Promise(function (resolve, reject) {
    _update_preprocess(user).then(function (preData) {
      _update_mainprocess(preData).then(function (user) {
        resolve(user)
      }).catch(function (err) {
        reject(err)
      });
    }).catch(function (err) {
      reject(err)
    })
  })
} // <= _update

// --------------------------------------------------------------------------------

function _update_mainprocess(preData) {
  //transformer le model business en model de persistance
  console.log("update_mainprocess data", preData)
  var toUpdate = {};
  if (preData.email) {
    if (!toUpdate['$set']) {
      toUpdate['$set'] = {};
    }

    toUpdate['$set']['credentials.email'] = preData.email;
  }

  if (preData.job) {
    if (!toUpdate['$set']) {
      toUpdate['$set'] = {};
    }
    toUpdate['$set']['job'] = preData.job;
  }

  if (preData.society) {
    if (!toUpdate['$set']) {
      toUpdate['$set'] = {};
    }
    toUpdate['$set']['society'] = preData.society;
  }

  if (preData.workspaces) {
    if (!toUpdate['$set']) {
      toUpdate['$set'] = {};
    }
    toUpdate['$set']['workspaces'] = preData.workspaces;
  }
  return new Promise(function (resolve, reject) {
    userModel.findByIdAndUpdate(preData._id, toUpdate, {
        new: true
      },
      function (err, userData) {
        if (err) {
          reject(err);
        } else {
          console.log("final update mainprocess data", userData)
          resolve(userData)
        }
      });
  })
} // <= _update_mainprocess

// --------------------------------------------------------------------------------

function _update_preprocess(userParams) {
  //controler les regles métier
  console.log("update preprocess : userParams || ", userParams)
  var email = new Promise(function (resolve, reject) {
    if (!userParams.email) {
      resolve(null);
    } else {
      _check_email(userParams.email).then(function (boolean) {
        console.log(boolean)
        if (!boolean) {
          reject("bad format email");
        } else {
          resolve(userParams.email);
        }
      })
    }

  })
  var job = new Promise(function (resolve, reject) {
    if (!userParams.job) {
      resolve(null);
    } else {
      _check_job(userParams.job).then(function (boolean) {
        if (!boolean)
          throw TypeError("bad format job");
        else resolve(userParams.job)
      })
    }
  })

  var society = new Promise(function (resolve, reject) {
    if (!userParams.society) {
      resolve(null);
    } else {
      _check_job(userParams.society).then(function (boolean) {
        if (!boolean)
          throw TypeError("bad format society");
        else resolve(userParams.society)
      })
    }
  })

  var workspace = new Promise(function (resolve, reject) {
    if (!userParams.workspaces) {
      resolve(null);
    } else resolve(userParams.workspaces)
  })
  return new Promise(function (resolve, reject) {
    Promise.all([email, job,society,workspace]).then(function (user_update_data) {
      var o = {};
      o['email'] = user_update_data[0];
      o['job'] = user_update_data[1];
      o['society'] = user_update_data[2];
      o['workspaces'] = user_update_data[3];
      o._id = userParams._id;
      console.log("final update preprocess data", o)
      resolve(o)
    }).catch(function (err) {
      reject(err)
    })
  })

} // <= _update_preprocess

// --------------------------------------------------------------------------------

function _check_email(email) {
  return new Promise(function (resolve, reject) {
    if (pattern.email.test(email)) {
      console.log("email", true)
      resolve(true)
    } else {
      resolve(false)
    };
  })
} // <= _check_email

function _check_name(name) {
  return new Promise(function (resolve, reject) {
    if (pattern.name.test(name)) {
      console.log("name", true)
      resolve(true)
    } else {
      resolve(false)
    };
  })
} // <= _check_name

function _check_job(job) {
  return new Promise(function (resolve, reject) {
    if (pattern.job.test(job)) {
      console.log("job", true)
      resolve(true)
    } else {
      resolve(false)
    };
  })
} // <= _check_job


// --------------------------------------------------------------------------------

function _hash_password(password, passwordConfirm) {
  return new Promise(function (resolve, reject) {
    if (password != passwordConfirm) {
      console.log('password != password confirme')
      reject(403);
    }

    if (!pattern.password.test(password)) {
      console.log('password != password pattern')
      reject(403);
    }

    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        throw err
      }
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          throw err
        } else {
          resolve(hash)
        }
      });
    })
  })
} // <= _hash_password


// --------------------------------------------------------------------------------


function _is_google_user(user) {
  return new Promise(function (resolve, reject) {
    userModel.findOne({
        'credentials.email': user.email
      })
      .exec(function (err, userData) {
        if (userData) {
          if (userData.googleId != null) {
            console.log("googleID")
            resolve(true)
          } else {
            resolve(false)
          }
        } else {
          resolve(false)
        }
      })
  })
} // <= _is_google_user



// --------------------------------------------------------------------------------