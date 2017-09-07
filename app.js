
/**
 * Application entrypoint
 */

let express = require('express');
let path = require('path');
let http = require('http');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let flash = require('connect-flash');
let redisConnect = require('connect-redis');
let session = require('express-session');
let passport = require('passport');
let config = require('./config/config');
let authenticate = require('./modules/authenticate');
let utils = require('./helpers/utils');
let extend = require('extend');
let compression = require('compression');
let view = require('./modules/view');
let viewHelpers = require('./helpers/viewHelpers');

let index = require('./routes/index');
let login = require('./routes/login');
let signup = require('./routes/signup');
let dashboard = require('./routes/dashboard');
let api = require('./routes/api');
let questionnaires = require('./routes/questionnaires');
let forgotPass = require('./routes/forgotPass');
let resetPass = require('./routes/resetPass');
let privacy = require('./routes/privacy');

// enable authentication through passport
authenticate(passport);


// initialize app
let app = express();


// define port
let port = utils.normalizePort(process.env.PORT || config.app.port);


// initialize redis store
let RedisStore = redisConnect(session);


// initialize session store
let sessionStore = new RedisStore({
    db: config.redis.db,
    host: config.redis.host,
    port: config.redis.port
});


// initialize session middleware
let sessionMiddleware = session({
    secret: config.session.secret,
    saveUninitialized: false,
    resave: true,
    store: sessionStore,
    rolling: true,
    cookie: {
        maxAge: config.cookie.maxAge
    }
});


// TODO: Remove compression in prod, replace with an nginx configuration
// compress data
app.use(compression());


// use session middleware
app.use(sessionMiddleware);


// initialize passport
app.use(passport.initialize());


// initialize passport session
app.use(passport.session());


// initialize flash
app.use(flash());


// initialize view helpers
viewHelpers.init(app);


// setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// configure bodyParser
app.use(bodyParser.json({
    limit: '5mb'
}));

app.use(bodyParser.urlencoded({
    extended: false,
    limit: '5mb'
}));


// configure cookieParser
app.use(cookieParser());
app.use(express.static('public'));


// set route handlers
app.use('/', index);
app.use('/dashboard', dashboard);
app.use('/signup', signup);
app.use('/api', api);
app.use('/questionnaires', questionnaires);
app.use('/forgot-password', forgotPass);
app.use('/reset-password', resetPass);
app.use('/privacy', privacy);


// initialize login page
login(app, passport);


// catch 404 error
app.use((req, res) => {
    "use strict";
    return res.render("default", extend(view.set('error', 'Error', req), {
        headerContent: {
            template: 'large',
            title: 'Page not found',
            subtitle: 'Please go back to the homepage or try a different url address.',
            buttonText: 'Homepage',
            buttonUrl: '/'
        },
        modules: []
    }));
});


// create server
let server = http.createServer(app);


// set server to listen on port
server.listen(port);


// handle HTTP error events
server.on('error', function(error) {
    "use strict";
    if ( error.syscall !== 'listen' ) {
        throw error;
    }
    let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});


// handle HTTP listening events
server.on('listening', function() {
    "use strict";
    let address = server.address();
    let bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;
    console.log(utils.logSuccessStartup(bind));
});

module.exports = app;