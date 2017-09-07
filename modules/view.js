
/**
 * Module: View
 */

let utils = require('../helpers/utils');
let config = require('../config/config');
let layout = require('../modules/layout');


exports.set = (name, title, req) => {
    'use strict';
    return {
        req: req,
        page: name,
        name: config.app.name,
        title: title+" | "+config.app.name,
        url: utils.getUrlPath(req.originalUrl),
        env: config.app.env,
        user: req.session ? req.session.user : {},
        isNormal: req.session.isNormal,
        isSuper: req.session.isSuper,
        isAuthenticated: req.isAuthenticated(),
        navigation: layout.getNav(req),
        settings: {
            year: new Date().getFullYear()
        },
        footer: {
            items: layout.getFooter()
        },
        modules: []
    };
};