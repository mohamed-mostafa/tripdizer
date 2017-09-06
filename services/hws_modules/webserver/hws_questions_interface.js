var questionsBusiness = require('../business/hws_questions_business.js');


var getAllQuestions = function(req, res) {
	try {
		// call the business function and give it a callback function 
		questionsBusiness.getAllQuestions(function(questions) {
			res.json(questions);
		},
		function(error){
			console.log(error);
			res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for the inconvinence.");
		});
	} catch (error) {
		console.log("An error occured in /questions");
		console.log(error);
		res.status(500).send("HWS servers are unable to serve your request at this time. We're sorry for any inconvinence.");
	}
};

exports.getAllQuestions = getAllQuestions;