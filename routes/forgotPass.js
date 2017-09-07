
/**
 * Route: Forgot Password
 */

let express = require('express');
let router = express.Router();
let extend = require('extend');
let request = require('request');
let config = require('../config/config');
let collection = require('../helpers/collection');
let utils = require('../helpers/utils');
let view = require('../modules/view');
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
    if ( req.isAuthenticated() ) {
        return res.redirect('/');
    }
    res.render("default", extend(view.set('forgot-password', 'Forgot Password', req), {
        modules: [{
            name: 'forgotPass',
            subtitle: 'Fill out the form below to reset your '+config.app.name+' password.'
        }],
        headerContent: {
            template: "small",
            title: 'Forgotten Password',
            subtitle: 'Request a password reset for your '+config.app.name+' account'
        },
        token: _tokens.create(_secret),
        captcha: { key: config.captcha.key }
    }));
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
            message: 'Missing user email. Make sure to provide a valid '+config.app.name+' email address.'
        });
    }

    request({
        url: utils.buildCaptchaUrl(config.captcha.url, config.captcha.secret, req.body.captcha, req.connection.remoteAddress),
        json: true
    }, (err, response, body) => {
        if ( err || body && !body.success ) {
            return res.json({
                status: 'error',
                message: 'Failed captcha verification. Please try again.'
            });
        }

        collection.getUserByEmail({
            key: req.body.email.trim()
        }, (err, user) => {
            if ( err || ! user) {
                return res.send({
                    status: 'error',
                    message: 'Invalid email. Make sure to provide a valid '+config.app.name+' email address.'
                });
            }
            passwordResetter.allowResetForUser(user.email, (err) => {

                if ( err ) {
                    return res.send({
                        status: 'error',
                        message: 'Unable to process password reset request. Please try again.'
                    });
                }

                emailer.sendEmail('user', 'passReset', user.email, config.email.from.noreply, {
                    appName: config.app.name,
                    user: user.firstName+' '+user.lastName,
                    resetLink: passwordResetter.getResetLink(req.protocol+'://'+req.headers.host, 'reset-password', user._id, user.email)
                }, (err) => {
                    if ( err ) {
                        return res.send({
                            status: 'error',
                            message: 'Unable to send password reset email. Please try again.'
                        });
                    }
                    res.json({
                        status: 'success',
                        message: 'Password reset email sent successfully. Please check your email at '+req.body.email+' for a password reset email from '+config.app.name+'.',
                        redirect: '/'
                    });
                });
            });
        });
    });
});

module.exports = router;