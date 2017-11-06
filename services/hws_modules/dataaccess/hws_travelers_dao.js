/**
 * The dataaccess methods of hws
 */

var daoUtilities = require("./hws_dao_utilities.js");


var getTravelerByEmailAddress = function(emailAddress, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT t.* FROM traveler t WHERE t.email_address = ?', [emailAddress], function(err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					console.log("An error occurred while trying to find a traveler with email " + emailAddress);
					console.log(err);
					connection.end();
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						var traveler = {
							id: rows[0].id,
							emailAddress: rows[0].email_address,
							mobile: rows[0].mobile,
							name: rows[0].name,
							dateOfBirth: rows[0].date_of_birth,
						};
						onSuccess(traveler);
					} else {
						connection.end();
						onSuccess(null);
					}
				}
			});
		}
	});
};

var createNewTraveler = function(traveler, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the traveler and his addresses
			connection.beginTransaction(function(err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('INSERT INTO traveler (name, mobile, email_address, date_of_birth) values (?, ?, ?, ?)',
							[traveler.name, traveler.mobile, traveler.emailAddress, traveler.dateOfBirth], function(err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to create the new traveler: " + traveler.name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// set the travelerId to the traveler
							traveler.id = result.insertId;
							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(traveler);
						}
					});
				}
			});
		}
	});
};


exports.createNewTraveler = createNewTraveler;
exports.getTravelerByEmailAddress = getTravelerByEmailAddress;