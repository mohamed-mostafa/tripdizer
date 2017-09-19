/**
 * The hws server exposing the REST services
 */

var start = function () {
	// initialize express
	var express = require('express');
	var cors = require('cors');
	var bodyParser = require('body-parser');
	var session = require('express-session');
	var MySQLStore = require('express-mysql-session')(session);
	var daoUtilities = require("../dataaccess/hws_dao_utilities.js");
	var connection = daoUtilities.createConnection();
	var sessionStoreOptions = {
		database: 'sessions',// Database name. 
		checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds. 
		expiration: 86400000,// The maximum age of a valid session; milliseconds. 
		createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist. 
		connectionLimit: 10,// Number of connections when creating a connection pool 
		schema: {
			tableName: 'sessions',
			columnNames: {
				session_id: 'session_id',
				expires: 'expires',
				data: 'data'
			}
		}
	};
	var sessionStore = new MySQLStore(sessionStoreOptions, connection);

	// interfaces
	var requestsInterface = require('./hws_requests_interface.js');
	var usersInterface = require('./hws_users_interface.js');
	var questionsInterface = require('./hws_questions_interface.js');
	var partnersInterface = require('./hws_partners_interface.js');

	var json2xls = require('json2xls');
	var app = express();
	// your express configuration here

	app.use(cors());// add CORS middleware (to enable cross-domain requests from clients.)
	app.use(bodyParser.json());// for parsing application/json
	app.use(json2xls.middleware); // middleware to return contenttype xls
	app.use(session({
		key: 'tripdizer',
		secret: 'tripdizer',
		store: sessionStore,
		resave: true,
		saveUninitialized: true
	}));

	// logged-in user middleware
	app.use(function (req, res, next) {
		//		console.log("in middleware");
		if (req.session != null) {
			//	    	console.log("session id: " + req.session.id);
			if (req.session.user != null) {
				//	    		console.log("user found");
				res.setHeader("user", req.session.user);
			}
		} else {
			//	    	console.log("session is null");
		}

		return next();
	});
	// routing - Start

	// requests
	app.put('/request/place', requestsInterface.placeRequest);
	app.get('/request/:requestId', requestsInterface.getRequestById);
	app.put('/request', requestsInterface.updateRequest);
	app.post('/request/assign', requestsInterface.assignRequestToUser);
	app.get('/request/statuses/summaries', requestsInterface.getRequestSummaries);
	app.get('/request/statuses/count', requestsInterface.getRequestSummariesCount);
	app.post('/request/statuses/sendmails', requestsInterface.sendMailsToRequestTraveler);
	app.post('/request/status', requestsInterface.changeRequestStatus);

	// questions
	app.get('/questions', questionsInterface.getAllQuestions);

	// 		set status
	app.post('/request/status/placed', requestsInterface.markRequestPlaced);
	app.post('/request/status/beingprepared', requestsInterface.markRequestBeingPrepared);
	app.post('/request/status/delivered', requestsInterface.markRequestDelivered);

	//		users
	app.get('/users', usersInterface.getAllUsers);
	app.get('/users/active', usersInterface.getAllActiveUsers);
	app.post('/user/login', usersInterface.loginUser);
	app.put('/user', usersInterface.createUser);
	app.post('/user', usersInterface.updateUser);

	//		partners
	app.get('/partners', partnersInterface.getAllPartners);
	app.get('/partners/active', partnersInterface.getAllActivePartners);
	app.put('/partner', partnersInterface.createPartner);
	app.post('/partner', partnersInterface.updatePartner);

	// routing - end

	var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
	var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

	app.listen(port, ipaddress, function () {
		console.log('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddress, port);
	});
};

exports.start = start;