var grouptripBusiness = require('../business/hws_grouptrip_business.js');
var requestBusiness = require('../business/hws_requests_business.js');

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
			grouptripBusiness.sendMail(email, function (response) {
				res.json(response)
			}, function (response) {
				res.json(response)
			});
		}
		
		// add the request in the database
		var request = {
			traveler: {
				name: name,
				mobile: phone,
				emailAddress: email,
				dateOfBirth: "",
			},
			questionAnswers: [
				{
					question: {id: 1, text: "Destinations", type: "MCQ"},
					answer: {answer: "Starting & ending at: Cairo, travelling to: " + trip}
				},
				{
					question: {id: 2, text: "Dates", type: "MCQ"},
					answer: {answer: "From: " + from + ", To: " + to}
				},
				{
					question: {id: 3, text: "Type", type: "MCQ"},
					answer: {answer: "Group Trip (" + pex + ")"}
				},
				{
					question: {id: 4, text: "Budget", type: "MCQ"},
					answer: {answer: "Economy"}
				},
				{
					question: {id: 5, text: "Interests", type: "MCQ"},
					answer: {answer: "N/A"}
				},
				{
					question: {id: 6, text: "Visa", type: "MCQ"},
					answer: {answer: "Visa assistance needed"}
				},
				{
					question: {id: 7, text: "TourGuide", type: "MCQ"},
					answer: {answer: "Tour guide needed"}
				},
				{
					question: {id: 8, text: "SpecialRequests", type: "MCQ"},
					answer: {answer: message}
				},
			],
		};
		requestBusiness.placeRequest(request, function(request) {
			// done
			console.log("Changing status of request: " + request.id);
			requestBusiness.changeRequestStatus(request.id.substring(3), "Group Trip", function(resp) {
				
			}, function (err) {
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
			})
		}, function(err) {
			res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
		}, function(userErr) {
			res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
		})
		
	} catch (error) {
		console.log("An error occured in /grouptrip/register");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

//-------------------------------------- SEARCH ------------------------------

exports.register = register;