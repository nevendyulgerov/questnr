/**
 * Helper: View Helpers
 */

let moment = require('moment');
let striptags = require('striptags');
let sanitizeHtml = require('sanitize-html');

let splitLines = function(str) {
    "use strict";
    return str.split('\n');
};

let replaceSpace = function(str) {
    "use strict";
    return str.replace(/&nbsp;/g, ' ');
};

let buildText = function(str) {
    "use strict";
    let lines = splitLines(str);
    let html = "";
    for ( let i = 0, j = lines.length; i < j; i++ ) {
        html += '<p>' + replaceSpace(lines[i]) + '</p>';
    }
    return html;
};

let boldText = function(str) {
    "use strict";
    let reGetBoldText = /[{bold}]+(.*)+[{/bold}]/;
    if ( reGetBoldText.test(str) ) {
        let matches = str.match(/[{bold}]+(.*)+[{/bold}]/);
        let rawText = matches[0].replace("{bold}", "").replace("{/bold}", "");
        return "<strong>"+rawText+"</strong>";
    } else {
        return str;
    }

};

let formatDate = function(dateStr) {
    "use strict";
    return moment(new Date(dateStr)).format("MMM. DD, YYYY");
};

let stripTags = function(str) {
    "use strict";
    return striptags(str);
};

let capitalize = function (str) {
    "use strict";
    return str.charAt(0).toUpperCase()+str.slice(1);
};

let sanitize = function(html) {
    "use strict";
    return sanitizeHtml(html, {
        allowedTags: false,
        allowedAttributes: false
    });
};

let numberWithCommas = (x) => {
    "use strict";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


/**
 * Init
 * @param app
 */
exports.init = (app) => {
    "use strict";
    app.locals.splitLines = splitLines;
    app.locals.replaceSpace = replaceSpace;
    app.locals.buildText = buildText;
    app.locals.boldText = boldText;
    app.locals.formatDate = formatDate;
    app.locals.stripTags = stripTags;
    app.locals.capitalize = capitalize;
    app.locals.sanitize = sanitize;
    app.locals.numberWithCommas = numberWithCommas;
};