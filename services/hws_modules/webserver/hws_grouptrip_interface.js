var grouptripBusiness = require('../business/hws_grouptrip_business.js');
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
		var from = req.body.from;
		var to = req.body.to;

		// send the package to the customer, only if it is morocco
		if (trip == "Morocco") {
			grouptripBusiness.sendMoroccoMail(email, function (response) {
				res.json(response)
			}, function (response) {
				res.json(response)
			});
		} else if (trip == "South Africa") {
			grouptripBusiness.sendCapetownMail(email, function (response) {
				res.json(response)
			}, function (response) {
				res.json(response)
			});
		}
		countryBusiness.getAll("", function (countries) {
			var targetedTrip = 1;
			for (var i = 0; i < countries.length; i++)
				if (countries[i].en_name === trip || countries[i].ar_name === trip)
					targetedTrip = countries[i].id;
			var request = {
				traveler: {
					name: name,
					mobile: phone,
					emailAddress: email,
					dateOfBirth: "",
				},
				departure_date: from,
				return_date: to,
				flexible_dates: 0,
				leaving_country: 'Cairo',
				first_country: targetedTrip,
				other_country: targetedTrip === 1 ? trip : '',
				second_country: 0,
				third_country: 0,
				travel_purpose: 4,
				number_of_travelers: pex,
				budget_category: 3,
				budget: 0,
				visa_assistance_needed: 1,
				tour_guide_needed: 1,
				specialRequests: message,
				interests: [{ id: 1, percentage: 0 }]
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
			})
		},
			function (error) {
				res.status(500).send("5: Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});

		// add the request in the database

	} catch (error) {
		console.log("An error occured in /grouptrip/register");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

//-------------------------------------- SEARCH ------------------------------

exports.register = register;