
/**
 * Route: Index
 */

// get modules
let express = require('express');
let router = express.Router();


/**
 * GET request
 */
router.get('/', (req, res) => {
    'use strict';
    if ( ! req.isAuthenticated() ) {
        return res.redirect('/login');
    }
    res.redirect('/dashboard');
});


module.exports = router;