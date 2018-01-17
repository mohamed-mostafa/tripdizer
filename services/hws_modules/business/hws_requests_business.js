/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var requestsDao = require('../dataaccess/hws_requests_dao.js');
var itinerariesDao = require('../dataaccess/hws_itineraries_dao.js');
var travelersDao = require('../dataaccess/hws_travelers_dao.js');
var partnersBusiness = require('./hws_partners_business.js');
var emailBusiness = require('./hws_email_business.js');
var Promise = require('promise');

//calls the onSuccess with a user object if the user was successfully created
var placeRequest = function (request, onSuccess, onFailure, onUserError) {
	// insert the request in our database
	request.date = new Date();
	request.departure_date = new Date(request.departure_date);
	request.return_date = new Date(request.return_date);
	if (!request.budget) request.budget = 0;

	travelersDao.getTravelerByEmailAddress(request.traveler.emailAddress, function (traveler) {
		if (traveler == null) { // traveler doesn't exist before, create a traveler first

			travelersDao.createNewTraveler(request.traveler, function (traveler) {

				// create the traveler
				requestsDao.createNewRequest(request, function (request) { // then create the request
					// if (request.questionAnswers[0].answer.answer.indexOf("Cambodia") > -1 ||
					// 	request.questionAnswers[0].answer.answer.indexOf("Hongkong") > -1 ||
					// 	request.questionAnswers[0].answer.answer.indexOf("Indonesia") > -1 ||
					// 	request.questionAnswers[0].answer.answer.indexOf("Laos") > -1 ||
					// 	request.questionAnswers[0].answer.answer.indexOf("Macau") > -1 ||
					// 	request.questionAnswers[0].answer.answer.indexOf("Malaysia") > -1 ||
					// 	request.questionAnswers[0].answer.answer.indexOf("Philippines") > -1 ||
					// 	request.questionAnswers[0].answer.answer.indexOf("Thailand") > -1 ||
					// 	request.questionAnswers[0].answer.answer.indexOf("Vietnam") > -1 ||
					// 	request.questionAnswers[0].answer.answer.indexOf("Singapore") > -1) {
					// 	request.id = "A100" + request.id; // asia
					// } else {
					// 	request.id = "E200" + request.id;
					// }
					onSuccess(request);

					// notify creation
					emailBusiness.sendEmail("bookings@tripdizer.com", "notifications@tripdizer.com", "Request #" + request.id + " is placed at Tripdizer", request.traveler.name + " has just placed a new request at Tripdizer. Visit the Dashboard to view its details.");
					notifyCustomer(request.traveler.emailAddress, request.traveler.name, request.id);
					partnersBusiness.notifyPartners(request, function () {
						console.log("Notified Partners");
					}, function () {
						console.log("Failed to notify partners");
					});
				}, function (err) {
					// respond to caller
					console.log("An error occured while saving a new request");
					console.log(err);
					onFailure(err);
				});
			}, function (err) {
				console.log("An error occured while creating a new traveler");
				console.log(err);
				onFailure(err);
			});
		} else { // traveler exists before, create the request immediately
			requestsDao.createNewRequest(request, function (request) { // create the request
				// if (request.questionAnswers[0].answer.answer.indexOf("Cambodia") > -1 || request.questionAnswers[0].answer.answer.indexOf("Hongkong") > -1 ||
				// 	request.questionAnswers[0].answer.answer.indexOf("Indonesia") > -1 ||
				// 	request.questionAnswers[0].answer.answer.indexOf("Laos") > -1 ||
				// 	request.questionAnswers[0].answer.answer.indexOf("Macau") > -1 ||
				// 	request.questionAnswers[0].answer.answer.indexOf("Malaysia") > -1 ||
				// 	request.questionAnswers[0].answer.answer.indexOf("Philippines") > -1 ||
				// 	request.questionAnswers[0].answer.answer.indexOf("Thailand") > -1 ||
				// 	request.questionAnswers[0].answer.answer.indexOf("Vietnam") > -1 ||
				// 	request.questionAnswers[0].answer.answer.indexOf("Singapore") > -1) {
				// 	request.id = "A100" + request.id; // asia
				// } else {
				// 	request.id = "E200" + request.id;
				// }
				onSuccess(request);

				// notify creation
				emailBusiness.sendEmail("bookings@tripdizer.com", "notifications@tripdizer.com", "Request #" + request.id + " is placed at Tripdizer", request.traveler.name + " has just placed a new request at Tripdizer. Visit the Dashboard to view its details.");
				notifyCustomer(request.traveler.emailAddress, request.traveler.name, request.id);
				partnersBusiness.notifyPartners(request, function () {
					console.log("Notified Partners");
				}, function () {
					console.log("Failed to notify partners");
				});
			}, function (err) {
				// respond to caller
				console.log("An error occured while saving a new request");
				console.log(err);
				onFailure(err);
			});
		}
	}, function (err) {
		console.log("An error occured while checking if traveler exists before");
		console.log(err);
		onFailure(err);
	});
};

var notifyCustomer = function (to, customerName, requestId) {
	// prepare email body
	var emailBody = "";
	emailBody += "<html>";
	emailBody += "<p style='font-weight: bold;'>Dear {customerName}</p>";
	emailBody += "<p>Thank you for submitting your travel request at Tripdizer. One of our agents will contact you as soon as possible.</p>";
	emailBody += "<p style='font-weight: bolder;'>Regards,</p>";
	emailBody += "<p style='font-weight: bold;'>Tripdizer Booking Team</p>";
	emailBody += "<p style='font-weight: italic; font-size: 8px; color: red;'>Important! Please don't reply to this email</p>";
	emailBody += "</html>";

	emailBody = emailBody.replace("{requestId}", requestId);
	emailBody = emailBody.replace("{customerName}", customerName);

	// notify creation
	emailBusiness.sendEmail(to, "Tripdizer Notifications <do-not-reply@tripdizer.com>", "Your Tripdizer request has been received", emailBody);
};
var sendMailsToRequestTraveler = function (email, onSuccess, onFailure) {
	if (email.type === "traveler") {
		sendMails(email.recipients, email, onSuccess);
	}
	else if (email.type === "request") {
		requestsDao.getRequestSummariesByStatus(email.recipients, function (travelers) {
			var emails = [];
			for (var i = 0; i < travelers.length; i++)
				emails.push(travelers[i].traveler.emailAddress)
			sendMails(emails, email, onSuccess);
		}, function (err) {
			console.log("An error occured while getting travelers");
			console.log(err);
			onFailure(err);
		});
	}
}

var sendMails = function (emails, email, onSuccess) {
	responses = [];
	for (var i = 0; i < emails.length; ++i)
		responses.push(emailBusiness.sendEmail(emails[i], "notifications@tripdizer.com", email.subject, email.body, email.attachments).then(function (response) { return response }).catch(function (response) { return response }));
	Promise.all(responses).then(function (resp) {
		email.response = resp;
		email.count = { success: resp.filter(function (item) { return item.done }).length, fail: resp.filter(function (item) { return !item.done }).length };
		onSuccess(email);
	});
}

var budgetCalculation = function (request, onSuccess, onFailure, onUserError) {
	var monthMap = { 1: "JAN", 2: "FEB", 3: "MAR", 4: "APR", 5: "MAY", 6: "JUN", 7: "JUL", 8: "AUG", 9: "SEP", 10: "OCT", 11: "NOV", 12: "DEC" };
	if (request.itinerary_id) {
		itinerariesDao.getById(request.itinerary_id, null, function (itinerary) {

			const rData = {
				itineraryId: request.itinerary_id,
				numberOfAdults: request.number_of_adults,
				numberOfKids: request.number_of_kids,
				numberOfInfants: request.number_of_infants,
				numberOfTravelers: request.number_of_adults + request.number_of_kids + request.number_of_infants,
				departureMonth: monthMap[new Date(request.departure_date).getMonth() + 1],
				returnMonth: monthMap[new Date(request.return_date).getMonth() + 1],
				totalBudget: 0
			};

			for (let i = 0, ferries = itinerary.ferries; i < itinerary.ferries.length; ++i) {
				rData.totalBudget += rData.numberOfTravelers * (ferries[i][rData.departureMonth] + ferries[i][rData.returnMonth]) / 2;
			}
			for (let i = 0, flights = itinerary.flights; i < itinerary.flights.length; ++i) {
				rData.totalBudget += rData.numberOfAdults * (flights[i]['a' + rData.departureMonth] + flights[i]['a' + rData.returnMonth]) / 2;
				rData.totalBudget += rData.numberOfKids * (flights[i]['k' + rData.departureMonth] + flights[i]['k' + rData.returnMonth]) / 2;
				rData.totalBudget += rData.numberOfInfants * (flights[i]['i' + rData.departureMonth] + flights[i]['i' + rData.returnMonth]) / 2;
			}
			for (let i = 0, hotels = itinerary.hotels; i < itinerary.hotels.length; ++i) {
				rData.totalBudget += rData.numberOfTravelers * (hotels[i][rData.departureMonth] + hotels[i][rData.returnMonth]) / 2;
			}
			onSuccess(rData);
		}, function (err) {
			console.log("An error occured while getting itinerary");
			console.log(err);
			onFailure(err);
		});
	} else {
		console.log("Itinerary Id doesn't exists!.");
		console.log(err);
		onFailure(err);
	}
};

var getRequestById = requestsDao.getRequestById;
var getRequestSummaries = requestsDao.getRequestSummariesByStatus
var getRequestSummariesCount = requestsDao.getRequestSummariesCountByStatus
var changeRequestStatus = requestsDao.modifyRequestStatusById

exports.placeRequest = placeRequest;
exports.getRequestById = getRequestById;
exports.assignRequestToUser = requestsDao.assignRequestToUser;
exports.updateRequest = requestsDao.updateRequest;

exports.getRequestSummaries = getRequestSummaries;
exports.getRequestSummariesCount = getRequestSummariesCount;
exports.sendMailsToRequestTraveler = sendMailsToRequestTraveler
exports.changeRequestStatus = changeRequestStatus;
exports.budgetCalculation = budgetCalculation