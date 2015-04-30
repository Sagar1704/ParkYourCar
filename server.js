// set up ======================================================================
// get all the tools we need

// This is the nodejs framework
var express  = require('express');
var app      = express();
var path     = require('path');

// Default ports
var port1      = process.env.port || 3000;
var port2      = process.env.port || 3001;
var securePort = process.env.port || 3002;

// ORM for MongoDB
var mongoose = require('mongoose');

// GZIP compression
var compress = require('compression');
// To use gzip compression
app.use(compress());

// TLS/SSL
var http     = require('http');
var https    = require('https');
var fs       = require('fs');
var options  = {
    key: fs.readFileSync('parkyourcar.key'),
    cert: fs.readFileSync('parkyourcar.crt')
};

// Memcache
var mc       = require('mc');
var mcClient = new mc.Client();

// OAuth Authentication
var passport = require('passport');
var flash    = require('connect-flash');

// Logger
var morgan       = require('morgan');


var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
//var session      = require('express-session');
var session      = require('client-sessions');

//Connect to the database
var configDB = require('./config/database.js');

// mongoose configuration ===========================================================
mongoose.connect(configDB.url); // connect to our database

mongoose.connection.on('open', function (ref) {
	console.log('Connected to mongo server.');	
});
mongoose.connection.on('error', function (err) {
	console.log('Could not connect to mongo server!');
	console.log(err);
});

// view engine setup
app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));
//app.engine('html', cons.swig);
app.set('view engine', 'ejs'); // set up ejs for templating

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true})); // get information from html forms

//API setup
app.use('/api', require('./app/api'));

// required for passport
app.use(session({
					cookieName : 'session',
					secret: 'parkyourcaratyourownrisk',
					duration : 30 * 60 * 1000,
					activeDuration : 5 * 60 * 1000
				})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// Handle 404
app.use(function(req, res) {
	res.status(400);
	res.render('404.ejs', {title: '404: File Not Found'});
});

// Handle 500
app.use(function(error, req, res, next) {
	res.status(500);
	res.render('500.ejs', {title: '500: Internal Server Error', error: error});
});

// launch ======================================================================
//app.listen(port1);
http.createServer(app).listen(port1);
http.createServer(app).listen(port2);
https.createServer(options, app).listen(securePort);
// console.log('The magic happens on port1 ' + port1);