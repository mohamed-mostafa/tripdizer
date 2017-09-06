/**
 * The business methods of hws
 * Some methods are just 1-to-1 mapping for the dataaccess methods. If you want to interrupt the call to them, replace the callback function sent to them
 */

var requestsDao = require('../dataaccess/hws_requests_dao.js');
var travelersDao = require('../dataaccess/hws_travelers_dao.js');
var partnersBusiness = require('./hws_partners_business.js');
var emailBusiness = require('./hws_email_business.js');

//calls the onSuccess with a user object if the user was successfully created
var placeRequest = function(request, onSuccess, onFailure, onUserError) {
	// insert the request in our database
	request.date = new Date();
	
	travelersDao.getTravelerByEmailAddress(request.traveler.emailAddress, function(traveler) {
		if (traveler == null) { // traveler doesn't exist before, create a traveler first
			
			travelersDao.createNewTraveler(request.traveler, function(traveler) {
				
				// create the traveler
				requestsDao.createNewRequest(request, function(request) { // then create the request
					if (request.questionAnswers[0].answer.answer.indexOf("Cambodia") > -1 ||
							request.questionAnswers[0].answer.answer.indexOf("Hongkong") > -1 ||
							request.questionAnswers[0].answer.answer.indexOf("Indonesia") > -1 ||
							request.questionAnswers[0].answer.answer.indexOf("Laos") > -1 ||
							request.questionAnswers[0].answer.answer.indexOf("Macau") > -1 ||
							request.questionAnswers[0].answer.answer.indexOf("Malaysia") > -1 ||
							request.questionAnswers[0].answer.answer.indexOf("Philippines") > -1 ||
							request.questionAnswers[0].answer.answer.indexOf("Thailand") > -1 ||
							request.questionAnswers[0].answer.answer.indexOf("Vietnam") > -1 ||
							request.questionAnswers[0].answer.answer.indexOf("Singapore") > -1 ) {
						request.id = "A100" + request.id; // asia
					} else {
						request.id = "E200" + request.id;
					}
					onSuccess(request);
					
					// notify creation
					emailBusiness.sendEmail("bookings@tripdizer.com", "notifications@tripdizer.com", "Request #" + request.id + " is placed at Tripdizer", request.traveler.name + " has just placed a new request at Tripdizer. Visit the Dashboard to view its details.");
					partnersBusiness.notifyPartners(request, function(){
						console.log("Notified Partners");
					}, function(){
						console.log("Failed to notify partners");
					});
				}, function(err) {
					// respond to caller
					console.log("An error occured while saving a new request");
					console.log(err);
					onFailure(err);
				});
			}, function(err) {
				console.log("An error occured while creating a new traveler");
				console.log(err);
				onFailure(err);
			});
		} else { // traveler exists before, create the request immediately
			requestsDao.createNewRequest(request, function(request) { // create the request
				if (request.questionAnswers[0].answer.answer.indexOf("Cambodia") > -1 ||							request.questionAnswers[0].answer.answer.indexOf("Hongkong") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Indonesia") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Laos") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Macau") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Malaysia") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Philippines") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Thailand") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Vietnam") > -1 ||
						request.questionAnswers[0].answer.answer.indexOf("Singapore") > -1 ) {
					request.id = "A100" + request.id; // asia
				} else {
					request.id = "E200" + request.id;
				}
				onSuccess(request);
				
				// notify creation
				emailBusiness.sendEmail("bookings@tripdizer.com", "notifications@tripdizer.com", "Request #" + request.id + " is placed at Tripdizer", request.traveler.name + " has just placed a new request at Tripdizer. Visit the Dashboard to view its details.");
				partnersBusiness.notifyPartners(request, function(){
					console.log("Notified Partners");
				}, function(){
					console.log("Failed to notify partners");
				});
			}, function(err) {
				// respond to caller
				console.log("An error occured while saving a new request");
				console.log(err);
				onFailure(err);
			});
		}
	}, function(err) {
		console.log("An error occured while checking if traveler exists before");
		console.log(err);
		onFailure(err);
	});
};

var getRequestById = requestsDao.getRequestById;

//------------------------- Get by status  ---------------------
var getCompletedRequestSummaries = function(onSuccess, onFailure) { // 'completed' requests at the admin app are all requests that are delivered
	var statuses = ['Completed']; 
	requestsDao.getRequestSummariesByStatus(statuses, onSuccess, onFailure);
};
var getPlacedRequestSummaries = function(onSuccess, onFailure) { // 'completed' requests at the admin app are all requests that are delivered
	var statuses = ['New']; 
	requestsDao.getRequestSummariesByStatus(statuses, onSuccess, onFailure);
};
var getInProgressRequestSummaries = function(onSuccess, onFailure) { // 'in proress' requests at the admin app are all requests that are currently running
	var statuses = ['In Progress']; 
	requestsDao.getRequestSummariesByStatus(statuses, onSuccess, onFailure);
};

// ------------------------- COUNTS ---------------------
var getPlacedRequestSummariesCount = function(onSuccess, onFailure) {
	var statuses = ['New']; 
	requestsDao.getRequestSummariesCountByStatus(statuses, onSuccess, onFailure);
};
var getInProgressRequestSummariesCount = function(onSuccess, onFailure) { // 'in progress' requests at the admin app are all requests that are being prepared or picked up
	var statuses = ['In Progress']; 
	requestsDao.getRequestSummariesCountByStatus(statuses, onSuccess, onFailure);
};
var getCompletedRequestSummariesCount = function(onSuccess, onFailure) { // 'completed' requests at the admin app are all requests that are delivered but not yet archived
	var statuses = ['Completed']; 
	requestsDao.getRequestSummariesCountByStatus(statuses, onSuccess, onFailure);
};

//------------------------- SET STATUS ---------------------

var markRequestPlaced = function(requestId, onSuccess, onFailure) {
	markRequestWithStatus(requestId, 'New', {}, onSuccess, onFailure);
};
var markRequestDelivered = function(requestId, onSuccess, onFailure) {
	markRequestWithStatus(requestId, 'Completed', {deliveredAt: new Date()}, function() {
		onSuccess();
	}, onFailure);
};
var markRequestBeingPrepared = function(requestId, onSuccess, onFailure) {
	markRequestWithStatus(requestId, 'In Progress', {}, function() {
		onSuccess();
	}, onFailure);
};

var markRequestWithStatus = requestsDao.modifyRequestStatusById;



exports.placeRequest = placeRequest;
exports.getRequestById = getRequestById;
exports.assignRequestToUser = requestsDao.assignRequestToUser;
exports.saveRequestToComment = requestsDao.saveRequestToComment;

exports.getCompletedRequestSummaries = getCompletedRequestSummaries;
exports.getPlacedRequestSummaries = getPlacedRequestSummaries;
exports.getInProgressRequestSummaries = getInProgressRequestSummaries;

exports.getCompletedRequestSummariesCount = getCompletedRequestSummariesCount;
exports.getPlacedRequestSummariesCount = getPlacedRequestSummariesCount;
exports.getInProgressRequestSummariesCount = getInProgressRequestSummariesCount;

exports.markRequestPlaced = markRequestPlaced;
exports.markRequestDelivered = markRequestDelivered;
exports.markRequestBeingPrepared = markRequestBeingPrepared;