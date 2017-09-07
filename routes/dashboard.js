
/**
 * Route: Dashboard
 */

let express = require('express');
let router = express.Router();
let extend = require('extend');
let view = require('../modules/view');
let collection = require('../helpers/collection');
let Tokens = require('csrf');
let config = require('../config/config');
let _tokens = new Tokens();
let _secret = _tokens.secretSync();


/**
 * GET request
 */
router.get('/', (req, res) => {
    'use strict';
    if ( ! req.isAuthenticated() ) {
        return res.redirect('/login');
    }
    res.render("default", extend(view.set('dashboard', 'Dashboard', req), {
        modules: [{
            name: 'dashboard'
        }],
        headerContent: {
            template: 'small',
            title: 'Dashboard',
            subtitle: 'Activities and events overview'
        },
        token: _tokens.create(_secret)
    }));
});


/**
 * POST request
 */
router.post('/questionnaires', (req, res) => {
    'use strict';
    if ( ! req.isAuthenticated() || ! _tokens.verify(_secret, req.body.token) ) {
        return res.send({
            status: 'error',
            message: 'Invalid request'
        });
    }

    collection.getQByAssigneeIDAndStatus({
        keys: [[req.session.user._id, config.statuses.questionnaires.assigned]],
    }, (err, questionnaires) => {
        res.send({
            status: 'success',
            data: err || !questionnaires ? [] : questionnaires
        });
    });
});


/**
 * POST request
 */
router.post('/questionnaires/by-status', (req, res) => {
    "use strict";
    if ( ! req.isAuthenticated() || ! _tokens.verify(_secret, req.body.token) ) {
        return res.send({
            status: 'error',
            message: 'Invalid request'
        });
    }
    let options = {};
    if ( req.body.status ) {
        options.key = req.body.status.trim();
    }
    collection.getQuestionnairesByStatus(options, (err, questionnaires) => {
        res.send({
            status: 'success',
            data: err ? [] : questionnaires
        });
    });
});


module.exports = router;