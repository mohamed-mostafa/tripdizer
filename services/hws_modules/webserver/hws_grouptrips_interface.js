var business = require('../business/hws_grouptrips_business.js');
var itineraryBusiness = require('../business/hws_itineraries_business.js');
var requestBusiness = require('../business/hws_requests_business.js');
var countryBusiness = require('../business/hws_countries_business.js');

var register = function (req, res) {
	try {
		var email = req.body.email;
		var name = req.body.name;
		var message = req.body.message;
		var pex = req.body.pex;
		var phone = req.body.phone;
		var trip = req.body.trip;

		// send the package to the customer, only if it is morocco
		// if (trip == "Morocco") {
		// 	business.sendMoroccoMail(email, function (response) {
		// 		res.json(response)
		// 	}, function (response) {
		// 		res.json(response)
		// 	});
		// } else if (trip == "South Africa") {
		// 	business.sendCapetownMail(email, function (response) {
		// 		res.json(response)
		// 	}, function (response) {
		// 		res.json(response)
		// 	});
		// } else if (trip == "Indonesia") {
		// 	business.sendBaliYogaRetreatMail(email, function (response) {
		// 		res.json(response)
		// 	}, function (response) {
		// 		res.json(response)
		// 	});
		// }
		business.getById(trip, null, function (groupTrip) {
				if (groupTrip) {
					var request = {
						traveler: {
							name: name,
							mobile: phone,
							emailAddress: email,
							dateOfBirth: "",
						},
						departure_date: groupTrip.departureDate,
						return_date: groupTrip.returnDate,
						flexible_dates: 0,
						leaving_country: 'Cairo',
						itinerary_id: groupTrip.iternaryId,
						first_country: 0,
						second_country: 0,
						third_country: 0,
						travel_purpose: 4,
						number_of_adults: pex,
						number_of_kids: 0,
						number_of_infants: 0,
						budget_category: 3,
						budget: pex * parseFloat(groupTrip.totalCost),
						visa_assistance_needed: groupTrip.needsVisa,
						tour_guide_needed: 1,
						specialRequests: message,
						estimatedCost: pex * parseFloat(groupTrip.totalCost),
						interests: [{
							id: 1,
							percentage: 0
						}]
					};
					requestBusiness.placeRequest(request, function (request) {
						// done
						console.log("Changing status of request: " + request.id);
						requestBusiness.changeRequestStatus(request.id, "Group Trip", function (resp) {

						}, function (err) {
							res.status(500).send("1; HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
						})
					}, function (err) {
						res.status(500).send("2: HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
					}, function (userErr) {
						res.status(500).send("3; HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
					});
				} else {
					res.status(500).send("4: HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
				}
			},
			function (error) {
				res.status(500).send("5: Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});

		// add the request in the database

	} catch (error) {
		console.log("An error occured in /groupTrips/register");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getById = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var id = req.params.id;
		var lang = req.query.lang;
		business.getById(id, lang, function (groupTrip) {
			res.json(groupTrip);
		}, function (error) {
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		}, function (businessError) {
			res.status(500).send(businessError);
		});
	} catch (error) {
		console.log("An error occured in /groupTrips/{Id}");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var toggle = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var id = req.body.tripId;
		var type = req.body.type;
		business.toggle(id, type, function (groupTrip) {
			res.json(groupTrip);
		}, function (error) {
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		}, function (businessError) {
			res.status(500).send(businessError);
		});
	} catch (error) {
		console.log("An error occured in /groupTrips");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var create = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var groupTrip = {
			iternaryId: req.body.iternaryId,
			departureDate: req.body.departureDate,
			returnDate: req.body.returnDate,
			numOfPersons: req.body.numOfPersons,
			totalCost: req.body.totalCost,
			image: req.body.image
		};
		business.create(groupTrip, function (groupTrip) {
				res.json(groupTrip);
			},
			function (error) {
				res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /groupTrips");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAll = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var lang = req.query.lang;
		business.getAll(lang, function (groupTrips) {
				res.json(groupTrips);
			},
			function (error) {
				res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /groupTrips");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAllCurrentTrips = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var lang = req.query.lang;
		business.getAllCurrentTrips(lang, function (groupTrips) {
				res.json(groupTrips);
			},
			function (error) {
				res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /groupTrips");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

exports.register = register;
exports.getById = getById;
exports.create = create;
exports.toggle = toggle;
exports.getAll = getAll;
exports.getAllCurrentTrips = getAllCurrentTrips;