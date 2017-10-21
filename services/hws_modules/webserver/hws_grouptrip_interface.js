var grouptripBusiness = require('../business/hws_grouptrip_business.js');

var register = function (req, res) {
	try {
		var email = req.body.email;
		// call the business function and give it a callback function 
		grouptripBusiness.sendMail(email, function (response) {
			res.json(response)
		}, function (response) {
			res.json(response)
		})
	} catch (error) {
		console.log("An error occured in /grouptrip/register");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

//-------------------------------------- SEARCH ------------------------------

exports.register = register;