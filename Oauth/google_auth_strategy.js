var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var UserModel = require('../models').user;
var config = require('../../configuration');


// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
            clientID: config.googleAuth.clientID,
            clientSecret: config.googleAuth.clientSecret,
            callbackURL: config.googleAuth.callbackURL,
        },
        function (token, refreshToken, profile, done) {
            process.nextTick(function () {
                UserModel.findOne({
                        'googleId': profile.id
                }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        user.googleToken = token
                        UserModel.findByIdAndUpdate(user._id, user, function (err, res) {
                            if (err) {
                                throw err;
                            }
                            return done(null, user);
                        });
                    } else {
                        var newUser = new User({
                            name: profile.displayName,
                            googleToken: token,
                            googleId: profile.id,
                            credentials: {
                                email: profile.emails[0].value
                            }
                        })
                        newUser.save(function (err, res) {
                            if (err) {
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        }))
} //<= passport_google_auth