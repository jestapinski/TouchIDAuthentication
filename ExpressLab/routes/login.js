
var User = require('../models/user.js')
var shortid = require('shortid');

//routes.js
exports.init = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });


    app.get('/touchlogin/:useremail', function(req, res) {
        User.byUser(req.params.useremail, function(err, rou) {
            console.log(rou[0]);
            if (rou[0].waitingToBeAuthenticated) {
                res.redirect('/');
                //res.render('touchlogin.ejs', { message: req.flash('loginMessage') , email: req.params.useremail, uniqueClient: shortid.generate()}); 
            }
            else {
                //add code here to set waitingToBeAuthenticated to true
                rou[0].waitingToBeAuthenticated = true;
                rou[0].serverToClientToken = shortid.generate();
                rou[0].save(function(err) {
                if (err) {
                    console.log(err);
                }
                });
                res.render('touchlogin.ejs', { message: req.flash('loginMessage') , email: req.params.useremail, uniqueClient: rou[0].serverToClientToken}); 
            }
        })
        // render the page and pass in any flash data if it exists
        //res.render('touchlogin.ejs', { message: req.flash('loginMessage') , email: req.params.useremail}); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
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

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // CONNECT SECTION =====================
    // =====================================

    app.get('/connect', isLoggedIn, function(req,res) {
        res.render('connect.ejs');

        // console.log(req.user);
        // req.user.phone_id = "12345";
        // console.log(req.user);
        // req.user.save
        // console.log(req.user);

    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
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

function initUserUpdate(req,res) {

}