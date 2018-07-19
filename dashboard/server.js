/**
 * The g2g server exposing the REST services
 */

var start = function () {
	// initialize express
	var express = require('express');
	var cors = require('cors');
	var path = require('path');
	var app = express();
	var auth = require('./auth');
	var passport = auth.passport;
	var bodyParser = require('body-parser');
	var flash = require('express-flash');

	// your express configuration here
	app.use('/', express.static(path.join(__dirname, 'static'))); // let the static folder be static exposed folder
	app.use(cors()); // add CORS middleware (to enable cross-domain requests from clients.)
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json()); // for parsing application/json
	app.use(express.session({
		secret: 'TRIPDIZER-JWT-SECRET'
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.set('view engine', 'ejs'); // let the res.render use ejs
	// routes
	app.get('/admin/login', function (req, res) {
		res.render('pages/login', {
			errorMsg: req.flash('loginMessage')[0]
		});
	});
	app.post('/admin/login', passport.authenticate('local', {
		successRedirect: '/admin/home', // redirect to the secure profile section
		failureRedirect: '/admin/login', // redirect back to the signup page if there is an error
		failureFlash: true
	}));
	app.get('/admin/logout', function (req, res) {
		req.logout();
		res.redirect('/admin/login');
	});
	app.get('/admin/home', auth.isAuthenticated, function (req, res) {
		res.render(req.user.isAdmin ? 'pages/index' : 'pages/non-admin-index', {
			user: req.user
		});
	});
	app.get('/admin/non-admin-index', function (req, res) {
		res.render(req.user.isAdmin ? 'pages/index' : 'pages/non-admin-index', {
			user: req.user
		});
	});
	app.get('/public', function (req, res) {
		res.render('pages/submit_request');
	});
	app.get('/admin/users', auth.isAuthenticated, function (req, res) {
		res.render('pages/users', {
			user: req.user
		});
	});
	app.get('/admin/partners', auth.isAuthenticated, function (req, res) {
		res.render('pages/partners', {
			user: req.user
		});
	});
	app.get('/admin/countries', auth.isAuthenticated, function (req, res) {
		res.render('pages/countries', {
			user: req.user
		});
	});
	app.get('/admin/itineraries', auth.isAuthenticated, function (req, res) {
		res.render('pages/itineraries', {
			user: req.user
		});
	});
	app.get('/admin/group-trips', auth.isAuthenticated, function (req, res) {
		res.render('pages/group-trips', {
			user: req.user
		});
	});
	app.get('/admin/videos', auth.isAuthenticated, function (req, res) {
		res.render('pages/videos', {
			user: req.user
		});
	});

	// routes end
	var port = process.env.PORT || 8081;
	app.listen(port, function () {
		console.log('%s: ControlCenter Node server started on %d ...', Date(Date.now()), port);
	});
};

start();