
/**
 * Module: Navigation
 */

let utils = require('../helpers/utils');
let config = require('../config/config');

let navigation = {
    dashboard: {
        slug: "dashboard",
        text: "Dashboard",
        link: "/dashboard",
        submenu: []
    },
    questionnaires: {
        slug: "questionnaires",
        text: "Questionnaires",
        link: "/questionnaires",
        submenu: []
    },
    login: {
        slug: "login",
        text: "Login",
        link: "/login",
        submenu: []
    },
    logout: {
        slug: "logout",
        text: "Log Out",
        link: "/logout",
        submenu: []
    },
    signup: {
        slug: "signup",
        text: "Sign Up",
        link: "/signup",
        submenu: []
    },
    profile: {
        slug: "profile",
        text: "Profile",
        link: "#",
        submenu: []
    }
};

let footer = [
    {
        slug: "homepage",
        text: config.app.name,
        link: "/"
    },
    {
        slug: "contact",
        text: "Contact",
        link: "mailto:"+config.email.from.support
    },
    {
        slug: "privacy",
        text: "Privacy",
        link: "/privacy"
    }
];


/**
 * Get Logged Super User Nav
 * @returns {Array}
 */
let getLoggedSuperUserNav = function() {
    'use strict';
    let navItems = utils.jsonCopy(navigation);
    let nav = [];
    nav.push(navItems.dashboard);
    nav.push(navItems.questionnaires);
    nav.push(navItems.profile);
    nav.push(navItems.logout);
    return nav;
};


/**
 * Get Logged User Nav
 * @returns {Array}
 */
let getLoggedUserNav = function() {
    'use strict';
    let navItems = utils.jsonCopy(navigation);
    let nav = [];
    nav.push(navItems.dashboard);
    nav.push(navItems.questionnaires);
    nav.push(navItems.profile);
    nav.push(navItems.logout);
    return nav;
};


/**
 * Get Guest User Nav
 * @returns {Array}
 */
let getGuestUserNav = function() {
    'use strict';
    let navItems = utils.jsonCopy(navigation);
    let nav = [];
    nav.push(navItems.login);
    nav.push(navItems.signup);
    return nav;
};


/**
 * Get Nav Items
 */
let getNav = (req) => {
    'use strict';
    return utils.jsonCopy(req.isAuthenticated() ? (req.session.isSuper ? getLoggedSuperUserNav() : getLoggedUserNav()) : getGuestUserNav());
};


/**
 * Get Footer
 */
let getFooter = () => {
    'use strict';
    return utils.jsonCopy(footer);
};


exports.getNav = getNav;
exports.getFooter = getFooter;