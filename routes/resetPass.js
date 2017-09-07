
/**
 * Route: Reset Password
 */

// get modules
let express = require('express');
let router = express.Router();
let extend = require('extend');
let request = require('request');
let view = require('../modules/view');
let config = require('../config/config');
let collection = require('../helpers/collection');
let utils = require('../helpers/utils');
let emailer = require('../modules/emailer');
let passwordResetter = require('../modules/passwordResetter');
let Tokens = require('csrf');
let _tokens = new Tokens();
let _secret = _tokens.secretSync();


/**
 * GET request
 */
router.get('/', (req, res) => {
    'use strict';
    if ( req.isAuthenticated() || ! req.query.id || ! req.query.email ) {
        return res.redirect('/');
    }

    passwordResetter.validateResetReq(req.query.id.trim(), req.query.email.trim(), (err) => {
        if ( err ) {
            return res.redirect('/');
        }

        res.render("default", extend(view.set('reset-password', 'Reset Password', req), {
            modules: [{
                name: 'resetPass',
                title: 'Reset password',
                subtitle: 'Fill out the form below to reset your '+config.app.name+' password.'
            }],
            token: _tokens.create(_secret),
            captcha: { key: config.captcha.key }
        }));
    });
});


/**
 * POST request
 */
router.post('/', (req, res) => {
    'use strict';
    if ( ! _tokens.verify(_secret, req.body.token) ) {
        return res.send({
            status: "error",
            message: "Invalid request. Reload the page and try again."
        });
    }
    if ( ! req.body.email || req.body.email === null ) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing user credentials. Make sure to provide a valid '+config.app.name+' email address.'
        });
    }

    request({
        url: utils.buildCaptchaUrl(config.captcha.url, config.captcha.secret, req.body.captcha, req.connection.remoteAddress),
        json: true
    }, (err, response, body) => {
        if ( ! body.success ) {
            return res.json({
                status: "error",
                message: 'Failed captcha verification. Please try again.'
            });
        }

        collection.getUserByEmail({
            key: req.body.email.trim()
        }, (err, user) => {
            if ( err ) {
                return res.send({
                    status: 'error',
                    message: 'Invalid email. Make sure to provide a valid '+config.app.name+' email address.'
                });
            }
            passwordResetter.resetPassword(user.email, req.body.password.trim(), (err) => {
                if ( err ) {
                    return res.send({
                        status: 'error',
                        message: 'Unable to update password for user with email ['+user.email+']. Please try again.'
                    });
                }

                emailer.sendEmail('user', 'successPassReset', user.email, config.email.from.noreply, {
                    appName: config.app.name,
                    user: user.firstName+' '+user.lastName
                }, () => {
                    res.json({
                        status: 'success',
                        message: 'You have successfully updated your '+config.app.name+' password. Redirecting to the login page...',
                        redirect: '/'
                    });
                });
            });
        });
    });
});

module.exports = router;