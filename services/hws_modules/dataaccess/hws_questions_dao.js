/**
 * The dataaccess methods of hws
 */

var daoUtilities = require("./hws_dao_utilities.js");

var getAllQuestions = function(onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM hws.question', [], function(err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					console.log("An error occurred while trying to list all questions");
					console.log(err);
					connection.end();
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						var questions = [];
						for (var i = 0; i < rows.length; i++) {
							var question = {
									id: rows[i].id,
									type: rows[i].type,
									text: rows[i].text,
									active: rows[i].active,
							};
							questions.push(question);
						}
						onSuccess(questions);
					} else {
						connection.end();
						onSuccess([]);
					}
				}
			});
		}
	});
};

exports.getAllQuestions = getAllQuestions;