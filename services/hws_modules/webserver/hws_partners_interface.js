var hwsPartnersBusiness = require('../business/hws_partners_business.js');

var updatePartner = function(req, res) {	
	try {
		// call the business function and give it a callback function 
		var partner = req.body.partner;
		hwsPartnersBusiness.updateExistingPartner(partner, function(partner) {
			res.json(partner);
		}, function(error){
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		}, function(businessError) {
			res.status(500).send(businessError);
		});
	} catch (error) {
		console.log("An error occured in /partner");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var createPartner = function(req, res) {	
	try {
		// call the business function and give it a callback function 
		var partner = req.body.partner;
		hwsPartnersBusiness.createNewPartner(partner, function(partner) {
			res.json(partner);
		},
		function(error){
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /partners");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAllPartners = function(req, res) {	
	try {
		// call the business function and give it a callback function 
		hwsPartnersBusiness.getAllPartners(function(partners) {
			res.json(partners);
		},
		function(error){
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /partners");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

var getAllActivePartners = function(req, res) {	
	try {
		// call the business function and give it a callback function 
		hwsPartnersBusiness.getAllActivePartners(function(partners) {
			res.json(partners);
		},
		function(error){
			res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /partners/active");
		console.log(error);
		res.status(500).send("Tripdizer servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};


exports.updatePartner = updatePartner;
exports.createPartner = createPartner;
exports.getAllPartners = getAllPartners;
exports.getAllActivePartners = getAllActivePartners;