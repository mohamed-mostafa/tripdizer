var requestsBusiness = require('../business/hws_requests_business.js');

var placeRequest = function(req, res) {	
	try {
		var request = req.body.request;
		// call the business function and give it a callback function 
		requestsBusiness.placeRequest(request, function(request) {
			res.json(request);
		},
		function(error){
			res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		}, function(userErrorMessage) {
			res.status(500).send(userErrorMessage);
		});
	} catch (error) {
		console.log("An error occured in /request/place");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getRequestById = function(req, res) {
	try {
		var requestId = req.params.requestId;
		// call the business function and give it a callback function 
		requestsBusiness.getRequestById(requestId, function(request) {
			res.json(request);
		},
		function(error){
			console.log(error);
			res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /request");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

// -------------------------------------- COUNTS ------------------------------

var getCompletedRequestSummariesCount = function(req, res) {
	try {
		// call the business function and give it a callback function 
		requestsBusiness.getCompletedRequestSummariesCount(function(count) {
			res.json({count: count});
		},
		function(error){
			res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /request/status/delivered/count");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getInProgressRequestSummariesCount = function(req, res) {
	try {
		// call the business function and give it a callback function 
		requestsBusiness.getInProgressRequestSummariesCount(function(count) {
			res.json({count: count});
		},
		function(error){
			res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /request/status/inprogress/count");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getPlacedRequestSummariesCount = function(req, res) {
	try {
		// call the business function and give it a callback function 
		requestsBusiness.getPlacedRequestSummariesCount(function(count) {
			res.json({count: count});
		},
		function(error){
			res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /request/status/placed/count");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

//-------------------------------------- GET BY STATUS ------------------------------

var getPlacedRequestSummaries = function(req, res) {
	try {
		// call the business function and give it a callback function 
		requestsBusiness.getPlacedRequestSummaries(
			function(requestSummaries) {
				res.json(requestSummaries);
			},
			function(error){
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /request/status/placed");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getCompletedRequestSummaries = function(req, res) {
	try {
		// call the business function and give it a callback function 
		requestsBusiness.getCompletedRequestSummaries(
			function(requestSummaries) {
				res.json(requestSummaries);
			},
			function(error){
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /request/status/delivered");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getInProgressRequestSummaries = function(req, res) {
	try {
		// call the business function and give it a callback function 
		requestsBusiness.getInProgressRequestSummaries(
			function(requestSummaries) {
				res.json(requestSummaries);
			},
			function(error){
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /request/status/inprogress");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

//-------------------------------------- SET STATUS ------------------------------

var markRequestBeingPrepared = function(req, res) {
	try {
		var requestId = req.body.requestId;
		// call the business function and give it a callback function 
		requestsBusiness.markRequestBeingPrepared(requestId,
			function() {
				res.json();
			},
			function(error){
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /request/ststus/beingprepared");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var markRequestDelivered = function(req, res) {
	try {
		var requestId = req.body.requestId;
		// call the business function and give it a callback function 
		requestsBusiness.markRequestDelivered(requestId,
			function() {
				res.json();
			},
			function(error){
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /request/ststus/delivered");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var markRequestPlaced = function(req, res) {
	try {
		var requestId = req.body.requestId;
		// call the business function and give it a callback function 
		requestsBusiness.markRequestPlaced(requestId,
			function() {
				res.json();
			},
			function(error){
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /request/ststus/placed");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var assignRequestToUser = function(req, res) {
	try {
		var requestId = req.body.requestId;
		var userId = req.body.userId;
		// call the business function and give it a callback function 
		requestsBusiness.assignRequestToUser(requestId, userId,
			function() {
				res.json();
			},
			function(error){
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /request/assign");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var saveCommentToRequest = function(req, res) {
	try {
		var requestId = req.body.requestId;
		var comment = req.body.comment;
		// call the business function and give it a callback function 
		requestsBusiness.saveRequestToComment(requestId, comment,
			function() {
				res.json();
			},
			function(error){
				res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /request/comment");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

//-------------------------------------- SEARCH ------------------------------

exports.placeRequest = placeRequest;
exports.getRequestById = getRequestById;
exports.assignRequestToUser = assignRequestToUser;
exports.saveCommentToRequest = saveCommentToRequest;

exports.getCompletedRequestSummariesCount = getCompletedRequestSummariesCount;
exports.getInProgressRequestSummariesCount = getInProgressRequestSummariesCount;
exports.getPlacedRequestSummariesCount = getPlacedRequestSummariesCount;

exports.getPlacedRequestSummaries = getPlacedRequestSummaries;
exports.getCompletedRequestSummaries = getCompletedRequestSummaries;
exports.getInProgressRequestSummaries = getInProgressRequestSummaries;

exports.markRequestBeingPrepared = markRequestBeingPrepared;
exports.markRequestDelivered = markRequestDelivered;
exports.markRequestPlaced = markRequestPlaced;