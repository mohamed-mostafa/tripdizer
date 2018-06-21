var formidable = require("formidable");
var business = require('../business/hws_grouptrips_business.js');

var register = function (req, res) {
	try {
		var request = {
			email: req.body.email,
			name: req.body.name,
			message: req.body.message,
			pex: req.body.pex,
			phone: req.body.phone,
			groupTripId: req.body.trip
		};
		// call the business function and give it a callback function
		business.register(request, function (groupTrip) {
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
		var form = new formidable.IncomingForm(),
			groupTrip = {
				mailAttachments: []
			};
		form.on('field', function (field, value) {
			groupTrip[field] = value;
		})
		form.on('file', function (field, file) {
			groupTrip.mailAttachments.push(file);
		})
		form.on('end', function () {
			// call the business function and give it a callback function 
			business.create(groupTrip, function (groupTrip) {
					res.json(groupTrip);
				},
				function (error) {
					res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
				});
		});
		form.parse(req);
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