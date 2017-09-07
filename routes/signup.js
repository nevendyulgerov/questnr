
/**
 * Route: Signup
 */

// get modules
let express = require('express');
let router = express.Router();
let extend = require('extend');
let request = require('request');
let config = require('../config/config');
let collection = require('../helpers/collection');
let utils = require('../helpers/utils');
let emails = require('../data/emails.json');
let view = require('../modules/view');
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
    res.render("default", extend(view.set('signup', 'Sign Up', req), {
        modules: [{
            name: 'signup',
            subtitle: 'Fill out the form below to sign up.'
        }],
        headerContent: {
            template: "small",
            title: 'Sign Up',
            subtitle: 'Sign up for a '+config.app.name+' account.'
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
    let postData = req.body;
    let newUser = {};
    let isAllowedEmail = false;
    let userRole = 0;

    if ( ! _tokens.verify(_secret, postData.token) ) {
        return res.send({
            status: 'error',
            message: 'Invalid request. Reload the page and try again.'
        });
    }
    if ( ! postData.email || postData.email === null || ! postData.password || postData.password === null || ! postData.firstName || postData.firstName === null || ! postData.lastName || postData.lastName === null ) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing user credentials. Make sure to provide valid email, first name, last name and password.'
        });
    }

    request({
        url: utils.buildCaptchaUrl(config.captcha.url, config.captcha.secret, postData.captcha, req.connection.remoteAddress),
        json: true
    }, (err, response, body) => {
        if ( ! body.success ) {
            return res.json({
                status: 'error',
                message: 'Failed captcha verification. Please try again.'
            });
        }

        collection.getUserByEmail({
            key: postData.email
        }, (err, user) => {
            if ( user ) {
                return res.json({
                    status: 'error',
                    message: 'Email already exists. Please use a different email address.'
                });
            }

            emails.map((a) => {
                if ( a.email.toLowerCase() === postData.email.toLowerCase() ) {
                    userRole = a.role;
                    isAllowedEmail = true;
                }
            });

            if ( ! isAllowedEmail ) {
                return res.json({
                    status: 'error',
                    message: 'Email address is not approved. Make sure to sign up with an approved '+config.app.name+' email address.'
                });
            }

            newUser.email = postData.email.trim();
            newUser.firstName = postData.firstName.trim();
            newUser.lastName = postData.lastName.trim();
            newUser.password = utils.encrypt({
                text: postData.password,
                key: config.encryption.key,
                iv: config.encryption.iv
            });
            newUser.role = userRole;
            newUser.activated = true;
            newUser.registered = new Date();
            newUser.ip = utils.getUserIP(req);

            collection.createUser(newUser, (err) => {
                if ( err ) {
                    return res.json({
                        status: 'error',
                        message: 'Registration failed! Connection error. Please, try again.'
                    });
                }
                res.json({
                    status: 'success',
                    message: 'You have successfully signed up for a '+config.app.name+' account. Redirecting to the login page...',
                    redirect: '/'
                });
            });
        });
    });
});


module.exports = router;