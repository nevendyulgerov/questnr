
/**
 * Route: API
 */

let express = require('express');
let router = express.Router();
let config = require('../config/config');


/**
 * POST request
 */
router.post('/settings', (req, res) => {
    'use strict';
    let data = {};
    let user;

    if ( req.isAuthenticated() ) {
        user = req.session.user;
        data.user = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isSuper: req.session.isSuper,
            activated: user.activated
        };
        data.idleTimeout = config.idleTimeout;
        data.questionnaires = {};
        data.questionnaires.statuses = config.questionnaires.statuses;
        data.questionnaires.format = config.questionnaires.format;
        data.appVersion = config.app.version;
    }
    data.appName = config.app.name;

    res.send({
        status: "success",
        data: data
    });
});


module.exports = router;