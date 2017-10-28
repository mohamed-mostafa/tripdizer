/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var requestsDao = require('../dataaccess/hws_requests_dao.js');
var travelersDao = require('../dataaccess/hws_travelers_dao.js');
var partnersBusiness = require('./hws_partners_business.js');
var emailBusiness = require('./hws_email_business.js');
var Promise = require('promise');

//calls the onSuccess with a user object if the user was successfully created
var placeRequest = function (request, onSuccess, onFailure, onUserError) {
	// insert the request in our database
	request.date = new Date();

	travelersDao.getTravelerByEmailAddress(request.traveler.emailAddress, function (traveler) {
		if (traveler == null) { // traveler doesn't exist before, create a traveler first

			travelersDao.createNewTraveler(request.traveler, function (traveler) {

				// create the traveler
				requestsDao.createNewRequest(request, function (request) { // then create the request
					if (request.questionAnswers[0].answer.answer.indexOf("Cambodia") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Hongkong") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Indonesia") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Laos") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Macau") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Malaysia") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Philippines") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Thailand") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Vietnam") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Singapore") > -1) {
						request.id = "A100" + request.id; // asia
					} else {
						request.id = "E200" + request.id;
					}
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
				if (request.questionAnswers[0].answer.answer.indexOf("Cambodia") > -1 || request.questionAnswers[0].answer.answer.indexOf("Hongkong") > -1 ||
					request.questionAnswers[0].answer.answer.indexOf("Indonesia") > -1 ||
					request.questionAnswers[0].answer.answer.indexOf("Laos") > -1 ||
					request.questionAnswers[0].answer.answer.indexOf("Macau") > -1 ||
					request.questionAnswers[0].answer.answer.indexOf("Malaysia") > -1 ||
					request.questionAnswers[0].answer.answer.indexOf("Philippines") > -1 ||
					request.questionAnswers[0].answer.answer.indexOf("Thailand") > -1 ||
					request.questionAnswers[0].answer.answer.indexOf("Vietnam") > -1 ||
					request.questionAnswers[0].answer.answer.indexOf("Singapore") > -1) {
					request.id = "A100" + request.id; // asia
				} else {
					request.id = "E200" + request.id;
				}
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
		responses.push(emailBusiness.sendEmail(emails[i], "notifications@tripdizer.com", email.subject, email.body, email.attachments).then(function(response) {return response}).catch(function(response) {return response}));
	Promise.all(responses).then(function(resp) {
		email.response = resp;
		email.count = { success: resp.filter(function (item) { return item.done }).length, fail: resp.filter(function (item) { return !item.done }).length };
		onSuccess(email);
	});
}

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