var business = require('../business/hws_itineraries_business.js');

var getById = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var id = req.params.id;
		var lang = req.query.lang;
		business.getById(id, lang, function (itinerary) {
			res.json(itinerary);
		}, function (error) {
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		}, function (businessError) {
			res.status(500).send(businessError);
		});
	} catch (error) {
		console.log("An error occured in /itinerary");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var update = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var itinerary = req.body.itinerary;
		business.update(itinerary, function (itinerary) {
			res.json(itinerary);
		}, function (error) {
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		}, function (businessError) {
			res.status(500).send(businessError);
		});
	} catch (error) {
		console.log("An error occured in /itinerary");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var create = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var itinerary = req.body.itinerary;
		business.create(itinerary, function (itinerary) {
			res.json(itinerary);
		},
			function (error) {
				res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /itinerary");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAll = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var lang = req.query.lang;
		business.getAll(lang, function (itineraries) {
			res.json(itineraries);
		},
			function (error) {
				res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /itineraries");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;