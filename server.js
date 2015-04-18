// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var path     = require('path');
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var compress = require('compression');
var http     = require('http');
var https    = require('https');
var fs       = require('fs');

var options = {
    key: fs.readFileSync('parkyourcar.key'),
    cert: fs.readFileSync('parkyourcar.crt')
};

var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
//var session      = require('express-session');
var session      = require('client-sessions');

//Connect to the database
var configDB = require('./config/database.js');

//To use gzip compression
app.use(compress());

// configuration ===============================================================
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
//app.listen(port);
http.createServer(app).listen(3000);
https.createServer(options, app).listen(3001);
console.log('The magic happens on port ' + port);