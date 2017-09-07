
/**
 * Route: Questionnaires
 */

let express = require('express');
let router = express.Router();
let extend = require('extend');
let utils = require('../helpers/utils');
let view = require('../modules/view');
let collection = require('../helpers/collection');
let sequence = require('../helpers/sequence');
let config = require('../config/config');
let moment = require('moment');
let Tokens = require('csrf');
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

    let assignedQ = [];
    let completedQ = [];
    let allQ = [];
    let totalQ = [];
    let pagination = {};
    let paginationIndex = 0;
    let start, end;
    let limit = req.query.limit ? parseInt(req.query.limit.trim(), 10) : 10;
    let skip = req.query.skip ? parseInt(req.query.skip.trim()) : 0;
    let filter = req.query.filter ? req.query.filter.trim() : 'any';
    let search = req.query.search ? req.query.search.trim() : '';

    sequence()
        .chain((seq) => {
            collection.getQByAssigneeIDAndStatus({
                keys: [[req.session.user._id, config.questionnaires.statuses.assigned]]
            }, (err, questionnaires) => {
                assignedQ = err || questionnaires.length === 0 ? [] : questionnaires;
                seq.resolve();
            });
        })
        .chain((seq) => {
            collection.getQByAssigneeIDAndStatus({
                keys: [[req.session.user._id, config.questionnaires.statuses.completed]]
            }, (err, questionnaires) => {
                completedQ = err || questionnaires.length === 0 ? [] : questionnaires;
                seq.resolve();
            });
        })
        .chain((seq) => {
            if ( !req.session.isSuper ) {
                return seq.resolve();
            }
            let options = { skip, limit };
            if ( filter !== 'any' && config.questionnaires.statuses.hasOwnProperty(filter) ) {
                options.key = config.questionnaires.statuses[filter];
            }
            if ( search === '' ) {
                return collection.getQuestionnairesByStatus(options, (err, questionnaires) => {
                    allQ = err || questionnaires.length === 0 ? [] : questionnaires;
                    seq.resolve();
                });
            }
            options.startkey = search;
            options.endkey = search+'\uf000';
            collection.getQByAssigneeEmail(options, (err, questionnaires) => {
                allQ = err || questionnaires.length === 0 ? [] : questionnaires;
                seq.resolve();
            });
        })
        .chain((seq) => {
            if ( !req.session.isSuper ) {
                return seq.resolve();
            }
            let options = {};
            if ( filter !== 'any' && config.questionnaires.statuses.hasOwnProperty(filter) ) {
                options.key = config.questionnaires.statuses[filter];
            }
            if ( search === '' ) {
                return collection.getQuestionnairesByStatus(options, (err, questionnaires) => {
                    totalQ = err || questionnaires.length === 0 ? [] : questionnaires;
                    seq.resolve();
                });
            }
            options.startkey = search;
            options.endkey = search+'\uf000';
            collection.getQByAssigneeEmail(options, (err, questionnaires) => {
                totalQ = err || questionnaires.length === 0 ? [] : questionnaires;
                seq.resolve();
            });
        })
        .chain(() => {
            if ( req.session.isSuper ) {
                pagination.index = '';
                paginationIndex = Math.floor(skip / limit + 1);
                start = skip === 0 ? skip * limit : skip;
                end = start + limit;

                pagination = {
                    index: paginationIndex,
                    hasPrev: paginationIndex > 1,
                    hasNext: skip + limit < totalQ.length
                };
            }

            res.render("default", extend(view.set('questionnaires', 'Questionnaires', req), {
                modules: [{
                    name: 'questionnaires',
                    assigned: assignedQ,
                    completed: completedQ,
                    all: req.session.isSuper ? allQ : []
                }],
                headerContent: {
                    template: 'small',
                    title: 'Questionnaires',
                    subtitle: 'Manage your questionnaires'
                },
                pagination: req.session.isSuper ? pagination : {},
                token: _tokens.create(_secret),
                captcha: { key: config.captcha.key }
            }));
        }).execute();
});


/**
 * POST request
 */
router.post('/', (req, res) => {
    "use strict";
    if ( ! req.isAuthenticated() || ! _tokens.verify(_secret, req.body.token) ) {
        return res.send({
            status: 'error',
            message: 'Invalid request'
        });
    }

    console.log(req.body.id);

    collection.getQuestionnairesByID({
        key: req.body.id
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
router.post('/get-questionnaire', (req, res) => {
    "use strict";
    if ( ! req.isAuthenticated() || ! _tokens.verify(_secret, req.body.token) ) {
        return res.send({
            status: 'error',
            message: 'Invalid request'
        });
    }
    console.log(req.body);
    collection.getQByID(req.body.id, (err, questionnaire) => {
        console.log(questionnaire);
        res.send({
            status: 'success',
            data: err ? {} : questionnaire
        });
    });
});


/**
 * POST request
 */
router.post('/get-users', (req, res) => {
    "use strict";
    if ( ! req.isAuthenticated() || ! _tokens.verify(_secret, req.body.token) ) {
        return res.send({
            status: 'error',
            message: 'Invalid request'
        });
    }
    collection.getUsersByRole({ key: req.body.role }, (err, users) => {
        res.send({
            status: 'success',
            data: err ? [] : users
        });
    });
});


/**
 * POST request
 */
router.post('/get-user', (req, res) => {
    'use strict';
    if ( ! req.isAuthenticated() || ! _tokens.verify(_secret, req.body.token) ) {
        return res.send({
            status: 'error',
            message: 'Invalid request'
        });
    }
    collection.getUserByID(req.body.id, (err, user) => {
        res.send({
            status: 'success',
            data: err ? {} : user
        });
    });
});


/**
 * POST request
 */
router.post('/create', (req, res) => {
    "use strict";
    if ( ! req.isAuthenticated() || ! _tokens.verify(_secret, req.body.token) ) {
        return res.send({
            status: 'error',
            message: 'Invalid request'
        });
    }

    let assignedUsers = JSON.parse(req.body.assignedUsers);
    utils.recurIter((index, resolve) => {
        let user = assignedUsers[index];
        console.log('user: '+user.email);
        collection.createQuestionnaire({
            assigneeID: user.id,
            assignorID: req.session.user._id,
            assigneeEmail: user.email,
            status: config.questionnaires.statuses.assigned,
            title: req.body.title.trim(),
            description: req.body.description.trim(),
            questions: JSON.parse(req.body.questions),
            answers: [],
            created: moment(new Date()).format('MMM. DD, YYYY')
        }, () => {
            resolve(index + 1 < assignedUsers.length);
        });
    }, () => {
        res.send({
            status: `success`,
            message: `Questionnaire with title "${req.body.title}" has been successfully created.`
        });
    });
});

/**
 * POST request
 */
router.post('/delete', (req, res) => {
    "use strict";
    if ( ! req.isAuthenticated() || !req.session.isSuper || ! _tokens.verify(_secret, req.body.token) ) {
        return res.send({
            status: 'error',
            message: 'Invalid request'
        });
    }

    let ids = JSON.parse(req.body.ids);
    utils.recurIter((index, resolve) => {
        let id = ids[index];
        collection.deleteQ(id, (err) => {
            if ( err ) {
                return res.send({
                    status: 'error',
                    message: 'Unable to delete questionnaire. Please refresh the page and try again.'
                });
            }
            resolve(index + 1 < ids.length);
        });
    }, () => {
        res.send({
            status: `success`,
            message: 'You have successfully deleted the selected questionnaire(s).',
            redirect: '/questionnaires'
        });
    });
});


/**
 * POST request
 */
router.post('/export', (req, res) => {
    "use strict";
    if ( ! req.isAuthenticated() || !req.session.isSuper || ! _tokens.verify(_secret, req.body.token) ) {
        return res.send({
            status: 'error',
            message: 'Invalid request'
        });
    }

    let ids = JSON.parse(req.body.ids);
    let data = [];
    utils.recurIter((index, resolve) => {
        let id = ids[index];
        collection.getQByID(id, (err, questionnaire) => {
            if ( err ) {
                return resolve(index + 1 < ids.length);
            }
            data.push({
                id: questionnaire._id,
                title: questionnaire.title,
                assigneeEmail: questionnaire.assigneeEmail,
                description: questionnaire.description,
                date: questionnaire.lastModified ? questionnaire.lastModified : questionnaire.created,
                questions: questionnaire.questions,
                answers: questionnaire.answers,
                status: questionnaire.status
            });
            resolve(index + 1 < ids.length);
        });
    }, () => {
        res.send({
            status: `success`,
            message: 'You have successfully exported the selected questionnaire(s).',
            data: data
        });
    });
});


/**
 * POST request
 */
router.post('/complete-questionnaire', (req, res) => {
    "use strict";
    if ( ! req.isAuthenticated() || ! _tokens.verify(_secret, req.body.token) ) {
        return res.send({
            status: 'error',
            message: 'Invalid request'
        });
    }
    let answers = JSON.parse(req.body.answers);

    collection.getQByAssigneeIDAndStatus({
        keys: [[req.body.assigneeID, config.questionnaires.statuses.assigned]]
    }, (err, questionnaires) => {
        if ( err ) {
            return res.send({
                status: 'error',
                message: 'No questionnaire found. Please try again.'
            });
        }
        collection.updateQuestionnaire(questionnaires[0]._id, {
            status: config.questionnaires.statuses.completed,
            answers: answers
        }, (err) => {
            if ( err ) {
                return res.send({
                    status: 'error',
                    message: 'Unable to update questionnaire. Please try again.'
                });
            }
            res.send({
                status: 'success',
                message: 'Questionnaire submitted successfully. This questionnaire will become viewable from the "Completed Questionnaires" section.',
                redirect: '/questionnaires'
            });
        });
    });
});


module.exports = router;