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
	app.get('/public', function(req, res) {
		res.render('pages/submit_request');
	});
	app.get('/admin/users', function(req, res) {
		res.render('pages/users');
	});
	app.get('/admin/partners', function(req, res) {
		res.render('pages/partners');
	});
	
	// routes end
	var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
    var port      = process.env.OPENSHIFT_NODEJS_PORT || 8081;
	app.listen(port, ipaddress, function() {
        console.log('%s: ControlCenter Node server started on %s:%d ...', Date(Date.now() ), ipaddress, port);
    });
};

start();