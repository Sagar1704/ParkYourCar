module.exports = function(app, passport) {
    //var api = require('./api');

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        //res.render('index.html'); // load the index.html file
            res.render('index.ejs', {
            title : 'Park Your Car',
            logo : 'images/lamborgini.jpg',
            description : 'Cool website to help you park your Car!!',
            about : '',
            rules : '',
            akshay : 'Akshay Thakare(asd@utdallas.edu)',
            aniket : 'Aniket Rahate(axr@utdallas.edu',
            sagar : 'Sagar Deshpande(ssd140830@utdallas.edu)'
        });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { 
            message: req.flash('signupMessage'),
            title : 'Park Your Car',
            logo : 'images/lamborgini.jpg' 
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // HELP ================================
    // =====================================
    app.get('/help', function(req, res) {
        res.render('help.ejs', {})
    });

    // =====================================
    // SEARCH ==============================
    // =====================================
    app.get('/search', isLoggedIn, function(req, res) {
        console.log('Search GET called');
        res.render('search.ejs', {});
    });

    /*app.post('/search', isLoggedIn, function(req, res) {
        console.log('Search POST called');
        res.render('search.ejs', {});
    });*/

    // =====================================
    // VIEW ================================
    // =====================================
    app.get('/view', function(req, res) {
        res.render('view.ejs', {})
    });    

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}