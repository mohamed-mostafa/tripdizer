/**
 * The g2g server exposing the REST services
 */

var start = () => {
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
	app.use(require('express-ejs-layouts'));
	app.set("layout extractScripts", true);
	app.set("layout extractStyles", true);
	app.set("layout extractMetas", true);
	// routes
	app.get('/admin/login', (req, res) => {
		res.locals = {
			title: 'Log in'
		};
		res.render('pages/login', {
			errorMsg: req.flash('loginMessage')[0],
			layout: false
		});
	});
	app.post('/admin/login', passport.authenticate('local', {
		failureRedirect: '/admin/login', // redirect back to the signup page if there is an error
		failureFlash: true
	}), (req, res) => {
		res.redirect(req.query.redirectURL || '/admin/home');
	});
	app.get('/admin/logout', (req, res) => {
		req.logout();
		var match = req.headers.referer ? (req.headers.referer).match(/^(?:[a-z][a-z0-9+\-.]*:(?:\/\/([^/?#]+))?)?(\/?[a-z0-9\-._~%!$&'()*+,;=@]+(?:\/[a-z0-9\-._~%!$&'()*+,;=:@]+)*\/?|\/)(?:[#?]|$)/) : null;
		if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
			req.originalUrl = match[2];
		} else {
			delete req.originalUrl;
		}
		auth.redirectToLogin(req, res);
	});
	app.get('/admin/home', auth.isAuthenticated, (req, res) => {
		res.locals = {
			title: 'Home',
			controller: 'HomePageContent'
		};
		res.render('pages/index', {
			user: req.user
		});
	});
	app.get('/admin/users', auth.isAuthenticatedAsAdmin, (req, res) => {
		res.locals = {
			title: 'Users',
			controller: 'UsersPageContent'
		};
		res.render('pages/users', {
			user: req.user
		});
	});
	app.get('/admin/partners', auth.isAuthenticated, (req, res) => {
		res.locals = {
			title: 'Partners',
			controller: 'PartnersPageContent'
		};
		res.render('pages/partners', {
			user: req.user
		});
	});
	app.get('/admin/countries', auth.isAuthenticated, (req, res) => {
		res.locals = {
			title: 'Countries',
			controller: 'CountriesPageContent'
		};
		res.render('pages/countries', {
			user: req.user
		});
	});
	app.get('/admin/itineraries', auth.isAuthenticated, (req, res) => {
		res.locals = {
			title: 'Itineraries',
			controller: 'ItinerariesPageContent'
		};
		res.render('pages/itineraries', {
			user: req.user
		});
	});
	app.get('/admin/group-trips', auth.isAuthenticated, (req, res) => {
		res.locals = {
			title: 'Group Trips',
			controller: 'GroupTrips'
		};
		res.render('pages/group-trips', {
			user: req.user
		});
	});
	app.get('/admin/videos', auth.isAuthenticated, (req, res) => {
		res.locals = {
			title: 'Videos',
			controller: 'Videos'
		};
		res.render('pages/videos', {
			user: req.user
		});
	});
	app.get('/admin/statuses', auth.isAuthenticatedAsAdmin, (req, res) => {
		res.locals = {
			title: 'Folders',
			controller: 'Statuses'
		};
		res.render('pages/statuses', {
			user: req.user
		});
	});
	app.get('*', auth.isAuthenticated, auth.renderTo404);

	// routes end
	var port = process.env.PORT || 8081;
	app.listen(port, () => {
		console.log('%s: ControlCenter Node server started on %d ...', Date(Date.now()), port);
	});
};

start();