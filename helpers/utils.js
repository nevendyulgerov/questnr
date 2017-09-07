
/**
 * Utils
 * Exposes common utility methods
 */
let cryptLib = require('cryptlib');
let config = require('../config/config');


/**
 * Encrypt
 * @param args
 * @returns {*}
 */
let encrypt = (args) => {
    "use strict";
    let key = cryptLib.getHashSha256(args.key, 32);
    return cryptLib.encrypt(args.text, key, args.iv);
};


/**
 * Decrypt
 * @param args
 * @returns {*}
 */
let decrypt = (args) => {
    "use strict";
    let key = cryptLib.getHashSha256(args.key, 32);
    return cryptLib.decrypt(args.text, key, args.iv);
};


/**
 * Get Url Path
 * @param url
 * @returns {*}
 */
let getUrlPath = (url) => {
    "use strict";
    let queryIndex = url.indexOf("?");
    return queryIndex > -1 ? url.substr(0, queryIndex) : url;
};


/**
 * Normalize Port
 * @param val
 * @returns {*}
 */
let normalizePort = (val) => {
    "use strict";
    let port = parseInt(val, 10);
    if ( isNaN(port) ) {
        return val;
    }
    if ( port >= 0 ) {
        return port;
    }
    return false;
};


/**
 * Get User IP
 * @param args
 * @returns {*}
 */
let getUserIP = (req) => {
    "use strict";
    let userIP = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.connection.socket.remoteAddress ||
        req.socket.remoteAddress;

    return userIP;
};


/**
 * Build Captcha URL
 * @param url
 * @param secret
 * @param response
 * @param address
 * @returns {string|XML}
 */
let buildCaptchaUrl = (url, secret, response, address) => {
    "use strict";
    return url
        .replace("{secret}", secret)
        .replace("{response}", response)
        .replace("{address}", address);
};


/**
 * Line
 * @param n
 * @returns {string}
 */
let line = (n) => {
    "use strict";
    return '\n'+Array.apply(null, {length: n}).map(() => {return '+-';}).join('')+'+\n';
};


/**
 * Log Success Startup
 * @param bind
 */
let logSuccessStartup = (bind) => {
    "use strict";
    return ''+line(20)+'\n'+
        '['+config.app.name+'] app started successfully.\n'+
        'App listening on: ['+bind+']\n'+
        'App version: ['+config.app.version+']\n'+
        line(20);
};


/**
 * Recursive Iterator
 * @param handler
 * @param complete
 * @param index
 */
let recurIter = (handler, complete, index) => {
    "use strict";
    index = index || 0;
    handler(index, (canRecur) => {
        if ( ! canRecur ) {
            return complete();
        }
        recurIter(handler, complete, ++index);
    });
};


/**
 * Poll
 * @param handler
 * @param complete
 * @param interval
 */
let poll = (handler, complete, interval) => {
    "use strict";
    setTimeout(() => {
        handler((canPoll) => {
            if ( canPoll ) {
                return poll(handler, complete, interval);
            }
            complete();
        });
    }, interval);
};


/**
 * JSON Copy
 * @param obj
 */
let jsonCopy = (obj) => {
    "use strict";
    return JSON.parse(JSON.stringify(obj));
};


exports.getUrlPath = getUrlPath;
exports.normalizePort = normalizePort;
exports.getUserIP = getUserIP;
exports.buildCaptchaUrl = buildCaptchaUrl;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.line = line;
exports.logSuccessStartup = logSuccessStartup;
exports.recurIter = recurIter;
exports.poll = poll;
exports.jsonCopy = jsonCopy;