
/**
 * Module: Emailer
 */

let nodeMailer = require('nodemailer');
let config = require('../config/config');
let templates = require('../data/emailTemplates.json');
let utils = require('../helpers/utils');
let sender = utils.jsonCopy(config.email.sender);
sender.auth.pass = utils.decrypt({
    text: sender.auth.pass,
    key: config.encryption.key,
    iv: config.encryption.iv
});
let transporter = nodeMailer.createTransport(sender);


/**
 * Send Email
 * @param role
 * @param templ
 * @param to
 * @param from
 * @param data
 * @param clb
 * @returns {*}
 */
let sendEmail = (role, templ, to, from, data, clb) => {
    "use strict";
    if ( !templates.hasOwnProperty(role) || !templates[role].hasOwnProperty(templ) ) {
        return clb(new Error('Invalid template'));
    }
    let template = templates[role][templ];

    template.to = to;
    template.from = from;
    Object.keys(data).forEach((a) => {
        let item = '{'+a+'}';
        if ( template.subject.indexOf(item) > -1 ) {
            template.subject = template.subject.replace(new RegExp(item, 'g'), data[a]);
        }
        if ( template.text.indexOf(item) > -1 ) {
            template.text = template.text.replace(new RegExp(item, 'g'), data[a]);
        }
        if ( template.html.indexOf(item) > -1 ) {
            template.html = template.html.replace(new RegExp(item, 'g'), data[a]);
        }
    });

    transporter.sendMail(template, clb);
};


exports.sendEmail = sendEmail;