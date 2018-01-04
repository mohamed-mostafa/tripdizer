var business = require('../business/hws_budgetcategories_business.js');

var getById = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var id = req.params.id;
		var lang = req.query.lang;
		business.getById(id, lang, function (budgetCategory) {
			res.json(budgetCategory);
		}, function (error) {
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		}, function (businessError) {
			res.status(500).send(businessError);
		});
	} catch (error) {
		console.log("An error occured in /budgetcategory");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var update = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var budgetCategory = req.body.budgetCategory;
		business.update(budgetCategory, function (budgetCategory) {
			res.json(budgetCategory);
		}, function (error) {
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		}, function (businessError) {
			res.status(500).send(businessError);
		});
	} catch (error) {
		console.log("An error occured in /budgetcategory");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var create = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var budgetCategory = req.body.budgetCategory;
		business.create(budgetCategory, function (budgetCategory) {
			res.json(budgetCategory);
		},
			function (error) {
				res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /budgetcategory");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAll = function (req, res) {
	try {
		// call the business function and give it a callback function 
		var lang = req.query.lang;
		business.getAll(lang, function (budgetcategories) {
			res.json(budgetcategories);
		},
			function (error) {
				res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
			});
	} catch (error) {
		console.log("An error occured in /budgetcategories");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;