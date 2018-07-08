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
	var auth = require('../app/auth/index');

	// interfaces
	require('../app/cron/index');
	var publicInterface = require('./hws_public_interface.js');
	var requestsInterface = require('./hws_requests_interface.js');
	var usersInterface = require('./hws_users_interface.js');
	var partnersInterface = require('./hws_partners_interface.js');
	var grouptripsInterface = require('./hws_grouptrips_interface.js');
	var countriesInterface = require('./hws_countries_interface.js');
	var itinerariesInterface = require('./hws_itineraries_interface.js');
	var purposesInterface = require('./hws_purposes_interface.js');
	var interestsInterface = require('./hws_interests_interface.js');
	var budgetcategoriesInterface = require('./hws_budgetcategories_interface.js');

	var json2xls = require('json2xls');
	var app = express();
	// your express configuration here

	app.use(cors()); // add CORS middleware (to enable cross-domain requests from clients.)
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json()); // for parsing application/json
	app.use(json2xls.middleware); // middleware to return contenttype xls

	// routing - Start

	// requests
	app.put('/request/place', requestsInterface.placeRequest);
	app.get('/request/:requestId', auth.isAuthenticated, requestsInterface.getRequestById);
	app.put('/request', auth.isAuthenticated, requestsInterface.updateRequest);
	app.post('/request/assign', auth.isAuthenticated, requestsInterface.assignRequestToUser);
	app.get('/request/statuses/summaries', auth.isAuthenticated, auth.isAuthenticated, requestsInterface.getRequestSummaries);
	app.get('/request/statuses/count', auth.isAuthenticated, requestsInterface.getRequestSummariesCount);
	app.post('/request/statuses/sendmails', auth.isAuthenticated, requestsInterface.sendMailsToRequestTraveler);
	app.post('/request/status', auth.isAuthenticated, requestsInterface.changeRequestStatus);
	app.post('/request/budgetcalc', requestsInterface.budgetCalculation);
	app.post('/request/recommendation', requestsInterface.recommendation);

	// 		set status
	app.post('/request/status/placed', auth.isAuthenticated, requestsInterface.markRequestPlaced);
	app.post('/request/status/beingprepared', auth.isAuthenticated, requestsInterface.markRequestBeingPrepared);
	app.post('/request/status/delivered', auth.isAuthenticated, requestsInterface.markRequestDelivered);
	app.put('/request/toggleoptions', auth.isAuthenticated, requestsInterface.toggleOptions);
	app.get('/request/package/:requestId', auth.isAuthenticated, requestsInterface.getPackage);

	//		users
	app.get('/users', auth.isAuthenticatedAsAdmin, usersInterface.getAllUsers);
	app.get('/users/active', auth.isAuthenticatedAsAdmin, usersInterface.getAllActiveUsers);
	app.post('/user/login', usersInterface.loginUser);
	app.put('/user', auth.isAuthenticatedAsAdmin, usersInterface.createUser);
	app.post('/user', auth.isAuthenticatedAsAdmin, usersInterface.updateUser);

	//		partners
	app.get('/partners', auth.isAuthenticated, partnersInterface.getAllPartners);
	app.get('/partners/active', auth.isAuthenticated, partnersInterface.getAllActivePartners);
	app.put('/partner', auth.isAuthenticated, partnersInterface.createPartner);
	app.post('/partner', auth.isAuthenticated, partnersInterface.updatePartner);

	// Group Trips
	app.get('/groupTrips', auth.isAuthenticated, grouptripsInterface.getAll);
	app.get('/groupTrips/current', grouptripsInterface.getAllCurrentTrips);
	app.get('/groupTrips/:id', auth.isAuthenticated, auth.isAuthenticated, grouptripsInterface.getById);
	app.post('/groupTrips', auth.isAuthenticated, grouptripsInterface.create);
	app.post('/groupTrips/register', grouptripsInterface.register);
	app.put('/groupTrips/toggle', auth.isAuthenticated, grouptripsInterface.toggle);
	app.put('/groupTrips', auth.isAuthenticated, grouptripsInterface.update);

	//		countries
	app.get('/countries', auth.isAuthenticated, countriesInterface.getAll);
	app.get('/countriesInIternaries', auth.isAuthenticated, countriesInterface.getAllCountriesInIternaries)
	app.get('/country/:id', auth.isAuthenticated, countriesInterface.getById);
	app.put('/country', auth.isAuthenticated, countriesInterface.create);
	app.post('/country', auth.isAuthenticated, countriesInterface.update);

	//		itineraries
	app.get('/itineraries', itinerariesInterface.getAll);
	app.get('/itinerary/:id', auth.isAuthenticated, itinerariesInterface.getById);
	app.put('/itinerary', auth.isAuthenticated, itinerariesInterface.create);
	app.post('/itinerary', auth.isAuthenticated, itinerariesInterface.update);

	//		Purposes
	app.get('/purposes', purposesInterface.getAll);
	app.get('/purpose/:id', auth.isAuthenticated, purposesInterface.getById);
	app.put('/purpose', auth.isAuthenticated, purposesInterface.create);
	app.post('/purpose', auth.isAuthenticated, purposesInterface.update);

	//		Interests
	app.get('/interests', interestsInterface.getAll);
	app.get('/interest/:id', auth.isAuthenticated, interestsInterface.getById);
	app.put('/interest', auth.isAuthenticated, interestsInterface.create);
	app.post('/interest', auth.isAuthenticated, interestsInterface.update);

	//		BudgetCategories
	app.get('/budgetcategories', budgetcategoriesInterface.getAll);
	app.get('/budgetcategory/:id', auth.isAuthenticated, budgetcategoriesInterface.getById);
	app.put('/budgetcategory', auth.isAuthenticated, budgetcategoriesInterface.create);
	app.post('/budgetcategory', auth.isAuthenticated, budgetcategoriesInterface.update);

	// Videos
	app.get('/public/videos', publicInterface.getVideos);
	app.post('/public/video', auth.isAuthenticated, publicInterface.create);
	app.put('/public/video', auth.isAuthenticated, publicInterface.update);

	// routing - end

	var port = process.env.PORT || 8080;

	app.listen(port, function () {
		console.log('%s: Node server started on %d ...', Date(Date.now()), port);
	});
};

exports.start = start;