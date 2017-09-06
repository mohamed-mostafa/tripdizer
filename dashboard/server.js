/**
 * The g2g server exposing the REST services
 */

var start = function () {
	// initialize express
	var express = require('express'); 
	var cors = require('cors');
	var path = require('path');
	var app = express();
	var ejs = require('ejs');
	
	// your express configuration here
	app.use('/', express.static(path.join(__dirname, 'static'))); // let the static folder be static exposed folder
	app.use(cors());// add CORS middleware (to enable cross-domain requests from clients.)
	app.set('view engine', 'ejs'); // let the res.render use ejs
	// routes
	app.get('/admin/home', function(req, res) {
		res.render('pages/login');
	});
	app.get('/admin/index', function(req, res) {
		res.render('pages/index');
	});
	app.get('/admin/non-admin-index', function(req, res) {
		res.render('pages/non-admin-index');
	});
	app.get('/admin/restaurants', function(req, res) {
		res.render('pages/restaurants');
	});
	app.get('/admin/categories', function(req, res) {
		res.render('pages/categories');
	});
	app.get('/public', function(req, res) {
		res.render('pages/submit_request');
	});
	app.get('/admin/side-groups', function(req, res) {
		res.render('pages/side-groups');
	});
	app.get('/admin/side-items', function(req, res) {
		res.render('pages/side-items');
	});
	app.get('/admin/zip-codes', function(req, res) {
		res.render('pages/zip-codes');
	});
	app.get('/admin/users', function(req, res) {
		res.render('pages/users');
	});
	app.get('/admin/partners', function(req, res) {
		res.render('pages/partners');
	});
	app.get('/admin/customers', function(req, res) {
		res.render('pages/customers');
	});
	app.get('/admin/plans', function(req, res) {
		res.render('pages/plans');
	});
	app.get('/admin/ads', function(req, res) {
		res.render('pages/ads');
	});
	app.get('/admin/configurations', function(req, res) {
		res.render('pages/configurations');
	});
	app.get('/admin/statistics', function(req, res) {
		res.render('pages/statistics');
	});
	app.get('/admin/messages', function(req, res) {
		res.render('pages/messages');
	});
	app.get('/admin/customers-insights', function(req, res) {
		res.render('pages/customers-insights');
	});
	app.get('/admin/drivers-insights', function(req, res) {
		res.render('pages/drivers-insights');
	});
	app.get('/admin/orders-insights', function(req, res) {
		res.render('pages/orders-insights');
	});
	app.get('/admin/restaurants-insights', function(req, res) {
		res.render('pages/restaurants-insights');
	});
	
	// routes end
	var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
    var port      = process.env.OPENSHIFT_NODEJS_PORT || 8081;
	app.listen(port, ipaddress, function() {
        console.log('%s: ControlCenter Node server started on %s:%d ...', Date(Date.now() ), ipaddress, port);
    });
};

start();