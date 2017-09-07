
/**
 * Route: Privacy
 */

let express = require('express');
let router = express.Router();
let extend = require('extend');
let view = require('../modules/view');
let config = require('../config/config');
let moment = require('moment');


/**
 * GET request
 */
router.get('/', (req, res) => {
    "use strict";
    res.render("default", extend(view.set('privacy', 'Privacy', req), {
        headerContent: {
            template: 'small',
            title: 'Privacy Policy'
        },
        modules: [{
            name: 'richText',
            content: `<p>This privacy policy sets out how <strong>${config.app.name}</strong> uses and protects any information that you give <strong>${config.app.name}</strong> when you use this website.</p><p><strong>${config.app.name}</strong> is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.</p><p><strong>${config.app.name}</strong> may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes. This policy is effective from <strong>${moment(new Date()).format('MMM.YYYY')}</strong>.</p>
            <h2>What we collect</h2>
            <p>We may collect the following information:</p>
                <ul>
                    <li>Name and job title</li>
                    <li>Contact information including email address</li>
                    <li>Demographic information such as postcode, preferences and interests</li>
                    <li>Other information relevant to customer surveys and/or offers</li>
                </ul>
                <h2>What we do with the information we gather</h2>
                <p>We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
                <h2>Internal record keeping</h2>
                <p>We may use the information to improve our products and services.</p>
                <p>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</p>
                <p>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.</p>
                
                <h2>Security</h2>
                <p>We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.</p>

                <h2>How we use cookies</h2>
                <p>A cookie is a small file which asks permission to be placed on your computer’s hard drive. Once you agree, the file is added and the cookie helps analyse web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.</p>
                <p>We use traffic log cookies to identify which pages are being used. This helps us analyse data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.</p>
                <p>Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.</p>
                <p>You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.</p>
                
                <h2>Links to other websites</h2>
                <p>Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.</p>
                
                <h2>Controlling your personal information</h2>
                <p>You may choose to restrict the collection or use of your personal information in the following ways:</p>
                <ul>
                    <li>Whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
                    <li>If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at <a href="mailto:${config.email.from.support}"><strong>${config.email.from.support}</strong></a></li>
                </ul>
                <p>We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.</p>`
        }]
    }));
});


module.exports = router;