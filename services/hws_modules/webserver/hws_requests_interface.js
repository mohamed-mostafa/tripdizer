var requestsBusiness = require('../business/hws_requests_business.js');

var placeRequest = function (req, res) {
	try {
		var request = req.body.request;
		// call the business function and give it a callback function 
		requestsBusiness.placeRequest(request, function (request) {
			res.json(request);
		},
			function (error) {
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}, function (userErrorMessage) {
				res.status(500).send(userErrorMessage);
			});
	} catch (error) {
		console.log("An error occured in /request/place");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getRequestById = function (req, res) {
	try {
		var requestId = req.params.requestId;
		// call the business function and give it a callback function 
		requestsBusiness.getRequestById(requestId, function (request) {
			res.json(request);
		},
			function (error) {
				console.log(error);
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /request");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getRequestSummaries = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var statuses = req.query.statuses;
		requestsBusiness.getRequestSummaries(statuses.split(','),
			function (requestSummaries) {
				res.json(requestSummaries);
			},
			function (error) {
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /request/status");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getRequestSummariesCount = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var statuses = req.query.statuses;
		var filter = req.query.filter ? JSON.parse(req.query.filter) : {};
		requestsBusiness.getRequestSummariesCount(statuses.split(','), filter, function (response) {
			res.json(response);
		},
			function (error) {
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /request/status/" + statuses + "/count");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var sendMailsToRequestTraveler = function (req, res) {
	try {
		var email = req.body.email;
		// call the business function and give it a callback function 
		requestsBusiness.sendMailsToRequestTraveler(email,
			function (response) {
				res.json(response);
			},
			function (error) {
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /request/statuses/sendmails");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var changeRequestStatus = function (req, res) {
	try {
		var requestId = req.body.requestId;
		var status = req.body.status;
		// call the business function and give it a callback function 
		requestsBusiness.changeRequestStatus(requestId, status,
			function () {
				res.json();
			},
			function (error) {
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /request/status");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

//-------------------------------------- SET STATUS ------------------------------

var markRequestBeingPrepared = function (req, res) {
	try {
		var requestId = req.body.requestId;
		// call the business function and give it a callback function 
		requestsBusiness.markRequestBeingPrepared(requestId,
			function () {
				res.json();
			},
			function (error) {
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /request/ststus/beingprepared");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var markRequestDelivered = function (req, res) {
	try {
		var requestId = req.body.requestId;
		// call the business function and give it a callback function 
		requestsBusiness.markRequestDelivered(requestId,
			function () {
				res.json();
			},
			function (error) {
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /request/ststus/delivered");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var markRequestPlaced = function (req, res) {
	try {
		var requestId = req.body.requestId;
		// call the business function and give it a callback function 
		requestsBusiness.markRequestPlaced(requestId,
			function () {
				res.json();
			},
			function (error) {
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /request/ststus/placed");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var assignRequestToUser = function (req, res) {
	try {
		var requestId = req.body.requestId;
		var userId = req.body.userId;
		// call the business function and give it a callback function 
		requestsBusiness.assignRequestToUser(requestId, userId,
			function () {
				res.json();
			},
			function (error) {
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /request/assign");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var updateRequest = function (req, res) {
	try {
		var request = req.body.request;
		// call the business function and give it a callback function 
		requestsBusiness.updateRequest(request,
			function () {
				res.json();
			},
			function (error) {
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /request");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

//-------------------------------------- SEARCH ------------------------------

var budgetCalculation = function (req, res) {
	try {
		var request = req.body.request;
		// call the business function and give it a callback function 
		requestsBusiness.budgetCalculation(request, function (request) {
			res.json(request);
		},
			function (error) {
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}, function (userErrorMessage) {
				res.status(500).send(userErrorMessage);
			});
	} catch (error) {
		console.log("An error occured in /request/budgetCalculation");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var recommendation = function (req, res) {
	try {
		var request = req.body.request;
		// call the business function and give it a callback function 
		requestsBusiness.recommendation(request, function (request) {
			res.json(request);
		},
			function (error) {
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			}, function (userErrorMessage) {
				res.status(500).send(userErrorMessage);
			});
	} catch (error) {
		console.log("An error occured in /request/recommendation");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

exports.placeRequest = placeRequest;
exports.getRequestById = getRequestById;
exports.assignRequestToUser = assignRequestToUser;
exports.updateRequest = updateRequest;

exports.getRequestSummaries = getRequestSummaries;
exports.getRequestSummariesCount = getRequestSummariesCount;
exports.sendMailsToRequestTraveler = sendMailsToRequestTraveler
exports.changeRequestStatus = changeRequestStatus;

exports.markRequestBeingPrepared = markRequestBeingPrepared;
exports.markRequestDelivered = markRequestDelivered;
exports.markRequestPlaced = markRequestPlaced;
exports.budgetCalculation = budgetCalculation;
exports.recommendation = recommendation;