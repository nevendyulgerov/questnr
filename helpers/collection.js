
/**
 * Helper: Collection
 * Provides methods for communication with the db
 */

let nano = require('nano');
let config = require('../config/config');
let CouchDB = require('../helpers/couchDB');
let Query = require('../helpers/query');
let nanoConfig = nano('http://'+config.db.host+":"+config.db.port);
let db = {
    users: new CouchDB({
        nano: nanoConfig,
        db: "users"
    }),
    questionnaires: new CouchDB({
        nano: nanoConfig,
        db: "questionnaires"
    })
};


/**
 * Create User
 * @param data
 * @param clb
 */
let createUser = (data, clb) => {
    "use strict";
    db.users.createDOC(data, clb);
};


/**
 * Create Questionnaire
 * @param data
 * @param clb
 */
let createQuestionnaire = (data, clb) => {
    "use strict";
    db.questionnaires.createDOC(data, clb);
};


/**
 * Get User By ID
 * @param id
 * @param clb
 */
let getUserByID = (id, clb) => {
    "use strict";
    db.users.get(id, true, clb);
};


/**
 * Get User By Email
 * @param options
 * @param clb
 */
let getUserByEmail = (options, clb) => {
    "use strict";
    let query = new Query();
    query.key = options.key;
    query.include_docs = options.includeDocs ? options.includeDocs : true;
    db.users.getView('users', 'ByEmail', query.normalize(), (err, body) => {
        if ( err ) {
            return clb(err);
        }
        if ( body.rows.length === 0 ) {
            return clb(new Error('No users found'));
        }
        return clb(null, body.rows[0].doc);
    });
};


/**
 * Update User
 * @param id
 * @param fields
 * @param clb
 */
let updateUser = (id, fields, clb) => {
    "use strict";
    db.users.modify(fields, id, clb);
};


/**
 * Update Questionnaire
 * @param id
 * @param fields
 * @param clb
 */
let updateQuestionnaire = (id, fields, clb) => {
    "use strict";
    db.questionnaires.modify(fields, id, clb);
};


/**
 * Get Questionnaires By ID
 * @param options
 * @param clb
 */
let getQuestionnairesByID = (options, clb) => {
    "use strict";
    let query = new Query();
    query.include_docs = options.includeDocs ? options.includeDocs : true;
    if ( options.key ) {
        query.key = options.key;
    }
    db.questionnaires.getView('questionnaires', 'ByAssigneeID', query.normalize(), (err, body) => {
        if ( err ) {
            return clb(err);
        }
        if ( body.rows.length === 0 ) {
            return clb(new Error('No questionnaires found'));
        }
        return clb(null, format(body.rows));
    });
};


/**
 * Get Questionnaire by ID
 * @param id
 * @param clb
 */
let getQByID = (id, clb) => {
    "use strict";
    db.questionnaires.get(id, true, clb);
};


/**
 * Get Questionnaires By Status
 * @param options
 * @param clb
 */
let getQuestionnairesByStatus = (options, clb) => {
    "use strict";
    getDataByView('questionnaires', 'questionnaires', 'ByStatus', options, clb);
};


/**
 * Get Questionnaires By AssigneeID and Status
 * @param options
 * @param clb
 */
let getQByAssigneeIDAndStatus = (options, clb) => {
    "use strict";
    getDataByView('questionnaires', 'questionnaires', 'ByAssigneeAndStatus', options, clb);
};


/**
 * Get Questionnaires By Assignee Email
 * @param options
 * @param clb
 */
let getQByAssigneeEmail = (options, clb) => {
    "use strict";
    getDataByView('questionnaires', 'questionnaires', 'ByAssigneeEmail', options, clb);
};


/**
 * Get Users By Role
 * @param options
 * @param clb
 */
let getUsersByRole = (options, clb) => {
    "use strict";
    getDataByView('users', 'users', 'ByRole', options, clb);
};


/**
 * Delete Questionnaire
 * @param id
 * @param clb
 */
let deleteQ = (id, clb) => {
    db.questionnaires.delete(id, clb);
};


/**
 * Get Data By View
 * @param dbName
 * @param design
 * @param view
 * @param options
 * @param clb
 */
let getDataByView = (dbName, design, view, options, clb) => {
    "use strict";
    let query = new Query();
    query.include_docs = options.includeDocs ? options.includeDocs : true;
    if ( options.key ) {
        query.key = options.key;
    }
    if ( options.startkey ) {
        query.startkey = options.startkey;
    }
    if ( options.endkey ) {
        query.endkey = options.endkey;
    }
    if ( options.keys ) {
        query.keys = options.keys;
    }
    if ( options.limit ) {
        query.limit = options.limit;
    }
    if ( options.skip ) {
        query.skip = options.skip;
    }
    db[dbName].getView(design, view, query.normalize(), (err, body) => {
        if ( err ) {
            return clb(err);
        }
        if ( body.rows.length === 0 ) {
            return clb(new Error('['+design+']['+view+'] No results found'));
        }
        return clb(null, format(body.rows));
    });
};


let format = (data) => {
    "use strict";
    return data.map((a) => { return a.doc; });
};


exports.createUser = createUser;
exports.updateUser = updateUser;
exports.getUserByID = getUserByID;
exports.getUsersByRole = getUsersByRole;
exports.getUserByEmail = getUserByEmail;
exports.getQuestionnairesByID = getQuestionnairesByID;
exports.getQuestionnairesByStatus = getQuestionnairesByStatus;
exports.createQuestionnaire = createQuestionnaire;
exports.updateQuestionnaire = updateQuestionnaire;
exports.getQByAssigneeIDAndStatus = getQByAssigneeIDAndStatus;
exports.getQByAssigneeEmail = getQByAssigneeEmail;
exports.getQByID = getQByID;
exports.deleteQ = deleteQ;