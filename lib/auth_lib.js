'use strict';

// const jwt = require('jsonwebtoken');
const jwt = require('jwt-simple');

const moment = require('moment');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const  userModel = require('../models/user_model');
const authenticationModel = require('../models/auth_model');

/** @type Configuration */
const config = require('../../../configuration');

/** @typedef {{authentication: AuthenticationParam}} BodyParam */
/** @typedef {{email: string, password: string}} AuthenticationParam */
/** @typedef {{exp: number}} Token */


class AuthLib {
  /**
   * Create Auth
   * create == 1 + 2
   * 1 - password
   * 2 - token + authentication model
   * @param {BodyParam} bodyParams
   * @return {Promise<*>}
   * @public
   */
  create(bodyParams) {
    return new Promise((resolve, reject) => {
      this._is_google_user(bodyParams.authentication).then((boolean) => {
        if (boolean == true) {
          if (config.quietLog != true) {
            //console.log("google user");
          }
          reject("google_user");
        } else {
          return this._create_preprocess(bodyParams.authentication);
        }
      }).then(preData => {
        return this._create_mainprocess(preData, bodyParams.authentication)
      }).then(token => {
        resolve(token);
      }).catch((err) => {
        reject(err)
      })
    })
  }


  /**
   * @param {AuthenticationParam} authenticationParams
   * @return {Promise<User>}
   * @private
   */
  _auth_find_promise(authenticationParams) {
    return new Promise((resolve, reject) => {
      userModel.findOne({
        'credentials.email': authenticationParams.email
      })
        .lean()
        .exec((err, userData) => {
          if (userData) {
            resolve(userData)
          } else {
            reject("no_account_found");
          }
        });
    })
  }

  /**
   * @param {AuthenticationParam} authenticationParams
   * @param userData
   * @return {Promise<any>}
   * @private
   */
  _bcrypt_promise(authenticationParams, userData) {
    return new Promise((resolve, reject) => {
      if (config.quietLog != true) {
        //console.log("userData ---------", userData)
      }
      bcrypt.compare(authenticationParams.password, userData.credentials.hashed_password, (err, isMatch) => {
        if (err) {
          console.log("compare_bcrypt ERRO -------")
          reject("compare_bcrypt");
        } else {
          console.log("isMatch")
          resolve(isMatch)
        }
      })
    })
  }

  /**
   * @param {AuthenticationParam} authenticationParams
   * @return {Promise<User>}
   * @private
   */
  _create_preprocess(authenticationParams) {
    return new Promise((resolve, reject) => {
      let out = {};
      this._auth_find_promise(authenticationParams).then(userData => {
        out = userData;
        return this._bcrypt_promise(authenticationParams, userData);
      }).then((result) => {
        //console.log("in result", result)
        if (result) {
          resolve(out)
        } else {
          reject("compare_bcrypt")
        }
      }).catch(err => {
        if (config.quietLog != true) {
          //console.log("--- bcrypt error ----", err)
        }
        reject(err)
      });
    })
  }

  /**
   * @param {User} user
   * @param {AuthenticationParam} authenticationParams
   * @return {Promise<Authentication>}
   * @private
   */
  _create_mainprocess(user, authenticationParams) {
    const payload = {
      exp: moment().add(14, 'days').unix(),
      iat: moment().unix(),
      iss: user._id,
      subject: user.googleid,
    }
    //console.log("in authentification")
    const token = jwt.encode(payload, config.secret);

    /** @type AuthenticationDocument */
    const authentication = new authenticationModel({
      user: user._id,
      token: token,
      dates: {
        created_at: new Date()
      }
    });
    //console.log(authentication)
    return new Promise((resolve, reject) => {
      authentication.save((err, authenticationData) => {
        if (err) {
          throw TypeError(err);
        } else {
          //console.log(authenticationData)
          resolve(authenticationData)
        }
      });
    })
  }

  /**
   * @param {Router} router
   * @public
   */
  google_auth(router) {
    router.get('/google',
      passport.authenticate('google', {
        scope: ['email', 'profile']
      }));
  }

  /**
   * @param {Router} router
   * @param {string} redirect_url
   * @public
   */
  google_auth_callbackURL(router, redirect_url) {
    router.get('/', passport.authenticate('google', {
      failureRedirect: '/login.html',
      session: false
    }), (req, res) => {
      //console.log('final request',req);
      res.redirect(redirect_url + res.req.user.googleToken);
    });
  }

  /**
   * @param {Router} router
   * @public
   */
  google_auth_statefull_verification(router) {
    router.post('/google_auth_statefull_verification', (req, res) => {
      if (config.quietLog != true) {
        //console.log("in callback")
        //console.log(req.body)
      }
      if (req.body.token != null) {
        userModel.findOne({
          googleToken: req.body.token
        }).lean().exec((err, user) => {
          if (config.quietLog != true) {
            //console.log("--- google user find ---", user)
          }
          if (user) {
            user.googleToken = null;
            user.active = true
            //console.log(user)
            userModel.findByIdAndUpdate(user._id, user, (err, user_update) => {
              if (err) {
                throw err;
              }
              const payload = {
                exp: moment().add(14, 'days').unix(),
                iat: moment().unix(),
                iss: user._id,
                subject: user.googleid,
              }
              var token = jwt.encode(payload, config.secret);
              if (config.quietLog != true) {
                //console.log("--- token user ---", token)
              }
              res.send({
                user: user_update,
                token: token
              });
            });
          } else {
            res.send("create account please");
          }
        })
      }
    })
  }

  /**
   * @param {AuthenticationParam} user
   * @returns {Promise<boolean>}
   * @private
   */
  _is_google_user(user) {
    return new Promise((resolve, reject) => {
      userModel.findOne({
        'credentials.email': user.email
      })
        .exec((err, userData) => {
          if (userData) {
            if (userData.googleId != null) {
              resolve(true)
            } else {
              resolve(false)
            }
          } else {
            resolve(false)
          }
        })
    })
  }

  /**
   * @param {string} token
   * @return {Object|false}
   * @public
   */
  get_decoded_jwt(token) {
    try {
      var decodedToken = jwt.decode(token, config.secret);

      if (token.exp <= Date.now()) {
        return false;
      }
      return decodedToken;
    } catch (err) {
      return false;
    }
  }

  /**
   * @param {string} token
   * @return {Promise<Object|false>}
   * @public
   */
  require_token(token) {
    return new Promise((resolve, reject) => {
      ////console.log(token);
      if (token == null) {
        resolve(false)
      } else {
        ////console.log("in service jwt", token );
        var decodedToken = jwt.decode(token, config.secret)
        ////console.log(decodedToken)
        if (token.exp <= Date.now()) {
          resolve(false);
        } else {
          resolve(decodedToken);
        }

      }
    }, (err) => {
      if (config.quietLog != true) {
        //console.log("-------- promise catch auth lib --------", err)
      }
      reject(false)
    })
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {*} next
   * @return {*}
   * @public
   */
  security_API(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['authorization']
    if (token != undefined) {
      token.split("");
      var decodedToken = jwt.decode(token.substring(4, token.length), config.secret);
      if (decodedToken.iss == null) {
        res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.decoded = decodedToken;
        next();
      }
    } else {
      if (config.quietLog != true) {
        //console.log('No token provided');
      }
      return res.status(403).send({
        success: false,
        message: 'No token provided'
      });
    }
  }
}

module.exports = new AuthLib()