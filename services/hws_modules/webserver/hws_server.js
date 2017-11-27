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
	var partnersInterface = require('./hws_partners_interface.js');
	var grouptripInterface = require('./hws_grouptrip_interface.js');
	var countriesInterface = require('./hws_countries_interface.js');
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

	app.get('/migration', function (req, res, next) {
		connection.connect(function (err) {
			var requests = [];
			connection.query('SELECT `Id`, `EN_Name` FROM `countries`', [], function (err, countryRows) {
				connection.query('SELECT tr.*, t.*, tqa.* FROM traveler_request tr JOIN traveler t on t.email_address = tr.traveler_email_address JOIN traveler_question_answer tqa ON tqa.traveler_request_id = tr.id', [], function (err, rows) {
					console.log("Migrating " + rows.length + " request QA");
					for (var i = 0; i < rows.length; i++) {
						var request;
						//var requestIndex = requests.findIndex(r => r.requestId === rows[i].Id);
						var requestIndex = -1;
						for (var ii = 0; ii < requests.length; ii++) {
							if (requests[ii].requestId === rows[i].Id) {
								requestIndex = ii;
							}
						}
						if (requestIndex === -1)
							request = {
								requestId: rows[i].Id,
								date: rows[i].Date,
								status: rows[i].Status,
								revenue: rows[i].Revenue,
								profit: rows[i].Profit,
								specialRequests: rows[i].Comments,
								traveler: {
									name: rows[i].name,
									mobile: rows[i].mobile,
									emailAddress: rows[i].email_address,
									dateOfBirth: rows[i].date_of_birth,
								},
								interests: []
							};
						else request = requests[requestIndex];

						if (rows[i].question_id === 1) {
							var regex = /Starting & ending at: ((?:(?!(\?|,)).)*), travelling to: ((?:(?!(\?|&|,|\sand\s)).)*)(?:,\s|\sand\s)?((?:(?!(\?|,|\sand\s)).)*)(?:\sand\s)?((?:(?!(\?|,|\sand\s)).)*)?/ig;
							var matched = regex.exec(rows[i].answer);
							if (rows[i].answer.match(regex)) {
								request.leaving_country = matched[1];
								//let c1 = countryRows.findIndex(c => c.EN_Name === matched[3]);
								//let c2 = countryRows.findIndex(c => c.EN_Name === matched[5]);
								//let c3 = countryRows.findIndex(c => c.EN_Name === matched[7]);
								var c1 = -1; var c2 = -1; var c3 = -1;
								for (var jj = 0; jj < countryRows.length; jj++) {
									if (countryRows[jj].EN_Name === matched[3]) {
										c1 = jj;
									}
									if (countryRows[jj].EN_Name === matched[5]) {
										c2 = jj;
									}
									if (countryRows[jj].EN_Name === matched[7]) {
										c3 = jj;
									}
								}
								if (c1 !== -1) request.first_country = countryRows[c1].Id;
								else { request.first_country = 1; request.other_country = matched[3] }
								if (c2 !== -1) request.second_country = countryRows[c2].Id;
								if (c3 !== -1) request.third_country = countryRows[c3].Id;
							} else {
								//console.log("Request didn't match destination pattern");
							}
						}
						else if (rows[i].question_id === 2) {
							if (request.requestId === 1710 || request.requestId === '1710') {
								console.log("1710: " + rows[i].answer);
							}
							var regex = /From: ([0-9]{1,2} [a-zA-Z]*, [0-9]{4}), To: ([0-9]{1,2} [a-zA-Z]*, [0-9]{4})(.*)?/ig;
							var matched = regex.exec(rows[i].answer);
							if (request.requestId === 1710 || request.requestId === '1710') {
								console.log("1710 matched: " + JSON.stringify(matched));
							}
							if (rows[i].answer.match(regex)) {
								request.departure_date = matched[1];
								request.return_date = matched[2];
								request.flexible_dates = matched[3] !== undefined ? 1 : 0;
							} else {
								if (request.requestId === 1710 || request.requestId === '1710') {
									console.log("1710: didn't match");
								}	
							}
						}
						else if (rows[i].question_id === 3) {
							var regex = /(?:(?:(.*) (?:Trip|travel)))(?: (?::\s)?(?:.*)?\(([0-9]+) persons\))?/ig;
							var matched = regex.exec(rows[i].answer);
							if (rows[i].answer.match(regex)) {
								if (matched[1] === 'Solo') request.travel_purpose = 2;
								else if (matched[1] === 'Family') request.travel_purpose = 3;
								else if (matched[1] === 'Group') request.travel_purpose = 4;
								else if (matched[1] === 'Join a group') { request.travel_purpose = 4; request.status = "Group Trip"; }
								else if (matched[1] === 'Honeymoon') request.travel_purpose = 5;
								else if (matched[1] === 'Business') request.travel_purpose = 6;
								else request.travel_purpose = 1;
								request.number_of_travelers = matched[2];
							}
						}
						else if (rows[i].question_id === 4) {
							var regex = /([a-z ]+)(?:: ([0-9]+)EGP|\(.*)/ig;
							var matched = regex.exec(rows[i].answer);
							if (rows[i].answer.match(regex)) {
								if (matched[1] === 'Super Economy') request.budget_category = 2;
								else if (matched[1] === 'Economy') request.budget_category = 3;
								else if (matched[1] === 'Mid Range') request.budget_category = 4;
								else if (matched[1] === 'Splurge') request.budget_category = 5;
								else {
									request.budget_category = 1;
									request.budget = matched[2];
								}
							}
						}
						else if (rows[i].question_id === 5) {
							var regex = /Activities:([0-9]+)(?:%)?, History: ([0-9]+)(?:%)?, Nightlife: ([0-9]+)(?:%)?, Beaches: ([0-9]+)(?:%)?, Natrue: ([0-9]+)(?:%)?(?:, Shopping: ([0-9]+)(?:%)?)?/ig;
							var matched = regex.exec(rows[i].answer);
							if (rows[i].answer.match(regex)) {
								request.interests.push({ id: 1, percentage: matched[1] || 0 },
									{ id: 2, percentage: matched[2] || 0 },
									{ id: 3, percentage: matched[3] || 0 },
									{ id: 4, percentage: matched[4] || 0 },
									{ id: 5, percentage: matched[5] || 0 },
									{ id: 6, percentage: matched[6] || 0 });
							}
						}
						else if (rows[i].question_id === 6) {
							var regex = /Visa assistance( not)? needed/ig;
							var matched = regex.exec(rows[i].answer);
							if (rows[i].answer.match(regex))
								request.visa_assistance_needed = matched[1] !== ' not' ? 1 : 0;
						}
						else if (rows[i].question_id === 7) {
							var regex = /Tour guide( not)? needed/ig;
							var matched = regex.exec(rows[i].answer);
							if (rows[i].answer.match(regex))
								request.tour_guide_needed = matched[1] !== ' not' ? 1 : 0;
						}
						if (request.status === 'Group Trip') {
							request.departure_date = '25 January, 2018';
							request.return_date = '31 January, 2018';
							request.flexible_dates = 0;
							request.leaving_country = 'Cairo';
							request.first_country = request.first_country;
							request.second_country = 0;
							request.third_country = 0;
							request.travel_purpose = 4;
							//request.number_of_travelers = pex;
							request.budget_category = 3;
							request.budget = 0;
							request.visa_assistance_needed = 1;
							request.tour_guide_needed = 1;
						}
						if (!request.leaving_country) request.leaving_country = 'Egypt';
						if (!request.first_country) {
							request.first_country = 1;
							request.other_country = '';
						}
						if (!request.other_country) request.other_country = '';
						if (!request.second_country) request.second_country = 0;
						if (!request.third_country) request.third_country = 0;
						if (!request.travel_purpose) request.travel_purpose = 1;
						if (!request.number_of_travelers) request.number_of_travelers = 1;
						if (!request.budget_category) request.budget_category = 1;
						if (!request.budget) request.budget = 0;
						if (!request.visa_assistance_needed) request.visa_assistance_needed = 0;
						if (!request.tour_guide_needed) request.tour_guide_needed = 0;
						if (!request.departure_date) request.departure_date = '1 January, 1900';
						if (!request.return_date) request.return_date = '1 January, 1900';
						if (!request.flexible_dates) request.flexible_dates = 0;
						//var requestIndex = requests.findIndex(r => r.requestId === rows[i].Id);
						var requestIndex = -1;
						for (var kk = 0; kk < requests.length; kk++) {
							if (requests[kk].requestId === rows[i].Id) {
								requestIndex = kk;
							}
						}
						if (requestIndex === -1) requests.push(request);
						else requests[requestIndex] = request;
						if (i === rows.length - 1) saveData(res, requests);
					}
				})
			});
		});
	});

	function convertToDate(input) {
		var pattern = /([0-9]{1,2})\s(.*?),\s([0-9]{2,4})/g;
		var result = input.replace(pattern, function (match, p1, p2, p3) {
			var months = { 'January': 01, 'February': 02, 'March': 03, 'April': 04, 'May': 05, 'June': 06, 'July': 07, 'August': 08, 'September': 09, 'October': 10, 'November': 11, 'December': 12 };
			return p3 + "-" + months[p2] + "-" + (p1 < 10 ? "0" + p1 : p1);
		});
		return result;
	}
	function saveData(res, requests) {
		var filteredRequests = { well: [], damaged: {} };
		var query = "";
		for (var i = 0; i < requests.length; ++i) {
			if (isNaN(new Date(convertToDate(requests[i].departure_date)).getTime()) || isNaN(new Date(convertToDate(requests[i].return_date)).getTime()) || !requests[i].first_country || !requests[i].interests.length === 6 || requests[i].interests.length === 0 || !requests[i].traveler.emailAddress) {
				if (!filteredRequests.damaged[requests[i].status]) filteredRequests.damaged[requests[i].status] = [];
				filteredRequests.damaged[requests[i].status].push(requests[i]);
			}
			else {
				filteredRequests.well.push(requests[i]);
				query += "UPDATE `traveler_request` SET `Departure_Date` = '" + convertToDate(requests[i].departure_date) + "', `Return_Date` = '" + convertToDate(requests[i].return_date) + "', `Flexible_Dates` = " + requests[i].flexible_dates + ", `Leaving_Country` = '" + requests[i].leaving_country + "', `First_Country` = " + requests[i].first_country + ", `Other_Country` = '" + requests[i].other_country + "', `Second_Country` = " + requests[i].second_country + ", `Third_Country` = " + requests[i].third_country + ", `Travel_Purpose` = " + requests[i].travel_purpose + ", `Number_Of_Travelers` = " + requests[i].number_of_travelers + ", `Budget_Category` = " + requests[i].budget_category + ", `Budget` = " + requests[i].budget + ", `Visa_Assistance_Needed` = " + requests[i].visa_assistance_needed + ", `Tour_Guide_Needed` = " + requests[i].tour_guide_needed + " WHERE Id = " + requests[i].requestId + ";";
				if (requests[i].interests.length > 0) {
					query += "INSERT INTO `traveler_interests` (`Interest_Id`, `Request_Id`, `Percentage`) VALUES ";
					for (var j = 0; j < requests[i].interests.length; j++) {
						var interest = requests[i].interests[j];
						query += "('" + interest.id + "', '" + requests[i].requestId + "', '" + interest.percentage + "'),";
					}
				}
				query = query.slice(0, -1) + ";";
			}
			if (i === requests.length - 1) {
				//res.send(filteredRequests); // See JSON Data
				res.send(query); // Query
			}
		}

	}

	// routing - end

	var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
	var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

	app.listen(port, ipaddress, function () {
		console.log('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddress, port);
	});
};

exports.start = start;