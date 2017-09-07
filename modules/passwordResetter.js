/**
 * Module: Password Resetter
 */

let _ = require('underscore');
let config = require('../config/config');
let utils  = require('../helpers/utils');
let collection = require('../helpers/collection');


/**
 * Get Reset Link
 * @param host
 * @param page
 * @param id
 * @param email
 * @returns {string}
 */
let getResetLink = (host, page, id, email) => {
    "use strict";
    return `${host}/${page}/?id=${id}&email=${email}`;
};


/**
 * Validate Reset Request
 * @param id
 * @param email
 * @param clb
 */
let validateResetReq = (id, email, clb) => {
    "use strict";
    collection.getUserByEmail({ key: email }, (err, user) => {
        if ( err ) {
            return clb(new Error('No user with email ['+email+']'), false);
        }
        if ( !_.isBoolean(user.resetPassword) || !user.resetPassword || user._id !== id ) {
            return clb(new Error('No reset requests for user with email ['+email+']'), false);
        }
        clb(null, true);
    });
};


/**
 * Allow Reset for User
 * @param email
 * @param clb
 */
let allowResetForUser = (email, clb) => {
    "use strict";
    collection.getUserByEmail({ key: email }, (err, user) => {
        if ( err ) {
            return clb(new Error('No user with email ['+email+']'), false);
        }
        collection.updateUser(user._id, {
            resetPassword: true
        }, clb);
    });
};


/**
 * Reset Password
 * @param email
 * @param newPass
 * @param clb
 */
let resetPassword = (email, newPass, clb) => {
    "use strict";
    collection.getUserByEmail({ key: email }, (err, user) => {
        if ( err ) {
            return clb(new Error('No user with email ['+email+']'), false);
        }
        collection.updateUser(user._id, {
            password: utils.encrypt({
                text: newPass,
                key: config.encryption.key,
                iv: config.encryption.iv
            }),
            resetPassword: false
        }, clb);
    });
};


exports.getResetLink = getResetLink;
exports.allowResetForUser = allowResetForUser;
exports.validateResetReq = validateResetReq;
exports.resetPassword = resetPassword;