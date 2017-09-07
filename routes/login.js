/**
 * Login
 */

// get modules
let express = require('express');
let nano = require('nano');
let request = require('request');
let extend = require('extend');
let config = require('../config/config');
let view = require('../modules/view');
let collection = require('../helpers/collection');
let utils = require('../helpers/utils');
let Tokens = require('csrf');


/**
 * Initialize Login
 * @param app
 * @param passport
 */
module.exports = (app, passport) => {
    'use strict';
    let _tokens = new Tokens();
    let _secret = _tokens.secretSync();

    /**
     * GET request
     */
    app.get('/login', (req, res) => {
        if ( req.isAuthenticated() ) {
            return res.redirect('/');
        }

        res.render('default', extend(view.set('login', 'Login', req), {
            modules: [{
                name: 'login',
                subtitle: 'Enter your '+config.app.name+' email and password'
            }],
            headerContent: {
                template: "small",
                title: 'Login',
                subtitle: 'Login to your '+config.app.name+' account.'
            },
            token: _tokens.create(_secret),
            captcha: { key: config.captcha.key }
        }));
    });


    /**
     * POST request
     */
    app.post('/login', (req, res, next) => {
        let postData = req.body;

        if ( ! _tokens.verify(_secret, postData.token) ) {
            return res.send({
                status: "error",
                message: "Invalid request. Reload the page and try again."
            });
        }
        if ( ! postData.email || postData.email === null || ! postData.password || postData.password === null ) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing user credentials. Make sure to provide valid email and password.'
            });
        }
        req.logOut();

        request({
            url: utils.buildCaptchaUrl(config.captcha.url, config.captcha.secret, postData.captcha, req.connection.remoteAddress),
            json: true
        }, (err, response, body) => {
            if ( ! body.success ) {
                return res.json({
                    status: "error",
                    message: 'Failed captcha verification. Please try again.'
                });
            }

            collection.getUserByEmail({
                key: postData.email
            }, (err) => {
                if ( err ) {
                    return res.send({
                        status: "error",
                        message: "Login failed. No such account found."
                    });
                }

                passport.authenticate('local', (err, user) => {
                    if ( err ) {
                        return res.send({
                            status: 'error',
                            message: 'User does not exist.'
                        });
                    }
                    if ( ! user ) {
                        return res.send({
                            status: 'error',
                            message: 'Invalid password. Please try again.'
                        });
                    }

                    req.logIn(user, function (err) {
                        if ( err ) {
                            return res.send({
                                status: 'error',
                                message: 'Cannot authenticate user. Please try again.'
                            });
                        }
                        req.session.user = user;
                        req.session.isNormal = user.role === 0;
                        req.session.isSuper = user.role === 1;
                        req.session.cookie.maxAge = config.cookie.maxAge;

                        return res.json({
                            status: 'success',
                            message: 'Login successful',
                            redirect: '/dashboard'
                        });
                    });
                })(req, res, next);
            });
        });
    });


    /**
     * POST request
     */
    app.post('/login/logout', (req, res) => {
        if ( ! req.isAuthenticated() ) {
            return res.send({
                status: "error",
                message: "Invalid request"
            });
        }

        req.logout();
        req.session.isNormal = false;
        req.session.isSuper = false;
        req.session.user = null;
        req.session.isLoggedOut = true;
        res.send({
            status: "success",
            redirect: "/"
        });
    });
};