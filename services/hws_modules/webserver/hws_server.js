/**
 * The hws server exposing the REST services
 */

var start = function () {
	// initialize express
	var express = require('express');
	var cors = require('cors');
	var bodyParser = require('body-parser');
	var daoUtilities = require("../dataaccess/hws_dao_utilities.js");
	var connection = daoUtilities.createConnection();

	// interfaces
	var requestsInterface = require('./hws_requests_interface.js');
	var usersInterface = require('./hws_users_interface.js');
	var partnersInterface = require('./hws_partners_interface.js');
	var grouptripInterface = require('./hws_grouptrip_interface.js');
	var countriesInterface = require('./hws_countries_interface.js');
	var itinerariesInterface = require('./hws_itineraries_interface.js');
	var purposesInterface = require('./hws_purposes_interface.js');
	var interestsInterface = require('./hws_interests_interface.js');
	var budgetcategoriesInterface = require('./hws_budgetcategories_interface.js');

	var json2xls = require('json2xls');
	var app = express();
	// your express configuration here

	app.use(cors());// add CORS middleware (to enable cross-domain requests from clients.)
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());// for parsing application/json
	app.use(json2xls.middleware); // middleware to return contenttype xls
	
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
	app.post('/request/budgetcalc', requestsInterface.budgetCalculation);
	app.post('/request/recommendation', requestsInterface.recommendation);

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

	// group trip mail
	app.post('/grouptrip/register', grouptripInterface.register);

	//		countries
	app.get('/countries', countriesInterface.getAll);
	app.get('/country/:id', countriesInterface.getById);
	app.put('/country', countriesInterface.create);
	app.post('/country', countriesInterface.update);

	//		itineraries
	app.get('/itineraries', itinerariesInterface.getAll);
	app.get('/itinerary/:id', itinerariesInterface.getById);
	app.put('/itinerary', itinerariesInterface.create);
	app.post('/itinerary', itinerariesInterface.update);

	//		Purposes
	app.get('/purposes', purposesInterface.getAll);
	app.get('/purpose/:id', purposesInterface.getById);
	app.put('/purpose', purposesInterface.create);
	app.post('/purpose', purposesInterface.update);

	//		Interests
	app.get('/interests', interestsInterface.getAll);
	app.get('/interest/:id', interestsInterface.getById);
	app.put('/interest', interestsInterface.create);
	app.post('/interest', interestsInterface.update);

	//		BudgetCategories
	app.get('/budgetcategories', budgetcategoriesInterface.getAll);
	app.get('/budgetcategory/:id', budgetcategoriesInterface.getById);
	app.put('/budgetcategory', budgetcategoriesInterface.create);
	app.post('/budgetcategory', budgetcategoriesInterface.update);

	// routing - end

	var port = process.env.PORT || 8080;

	app.listen(port, function () {
		console.log('%s: Node server started on %d ...', Date(Date.now()), port);
	});
};

exports.start = start;