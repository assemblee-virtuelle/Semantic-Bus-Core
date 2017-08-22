var authenticationLib = require('./auth_lib')
var userLib = require('./user_lib')

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = {
    create: _create
};


// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

// create ==  identification + auth 


function _create(user_infos) {
    if (user_infos.user == null) {
        throw TypeError("no user data");
    }

    function authenticationPromise(user) {
        return new Promise(function (resolve, reject) {
            authenticationLib.create({
                authentication: {
                    email: user.user.email,
                    password: user.user.password
                }
            }).then(function (token) {
                console.log(token)
                resolve(token)
            }).catch(function (err) {
                reject(err)
            })
        });
    }

    return new Promise(function (resolve, reject) {
        userLib.create(user_infos).then(function (userLibResult) {
            console.log(userLibResult)
            authenticationPromise(user_infos).then(function (token) {
                resolve({token: token, user: user_infos})
            }).catch(function (err) {
                reject(err)
            })
        }).catch(function (err) {
            reject(err)
        })
    })

} // <= _create