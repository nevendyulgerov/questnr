
/**
 * Module: Authenticate
 * Exposes methods for authentication
 */

let utils = require('../helpers/utils');
let config = require('../config/config');
let collection = require('../helpers/collection');
let LocalStrategy = require('passport-local').Strategy;


/**
 * Configure Passport
 * @param passport
 */
module.exports = (passport) => {
    "use strict";

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        done(null, {user: id});
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true

    }, (req, adminEmail, password, done) => {
        process.nextTick(function () {

            collection.getUserByEmail({
                key: adminEmail
            }, (err, user) => {
                if ( err ) {
                    return done(err);
                }

                if ( ! user || user.length === 0 ) {
                    return done(null, false, {
                        message: 'Unknown user: '+adminEmail
                    });
                }

                if ( ! user.password || user.password.length === 0 ) {
                    return done(null, false, {
                        message: 'Missing password for: '+adminEmail
                    });
                }

                let encryptedPass = utils.encrypt({
                    text: password,
                    key: config.encryption.key,
                    iv: config.encryption.iv
                });

                if ( encryptedPass !== user.password ) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
                return done(null, user);
            });
        });
    }));
};