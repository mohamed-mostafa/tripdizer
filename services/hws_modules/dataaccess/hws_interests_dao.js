/**
 * The dataaccess methods of hws
 */

var daoUtilities = require("./hws_dao_utilities.js");

var getById = function (id, lang, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM Interests WHERE id = ?', [id], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to find a interest with id " + id);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						// populate the interest attributes
						var interest = {
							id: rows[0].Id,
							en_name: rows[0].EN_Name,
							ar_name: rows[0].AR_Name
						};

						if (lang) {
							interest.name = interest[lang.toLowerCase() + '_name'];
							interest.description = interest[lang.toLowerCase() + '_description'];
						}

						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(interest);
					} else {
						// no interest is found with the id
						connection.end();
						onSuccess(null);
					}
				}

			});
		}
	});
};


var create = function (interest, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the interest and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('INSERT INTO Interests (EN_Name, AR_Name) values (?, ?)', [interest.en_name, interest.ar_name], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to create the new interest: " + interest.en_name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// set the interestId to the interest
							interest.id = result.insertId;

							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(interest);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a interest object if successful
//calls the onFailure with an err object in case of technical error
var update = function (interest, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the interest and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('UPDATE Interests SET EN_Name = ?, AR_Name = ?', [interest.en_name, interest.ar_name, interest.id], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							console.log("An error occurred while trying to update the existing interest: " + interest.en_name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							// end the connection
							connection.end();
							onFailure(err);
						} else {
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(interest);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a list of delivery persons or an empty list
//calls the onFailure with an err object in case of technical error
var getAll = function (lang, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM Interests', [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all interests");
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					var interests = [];
					// populate the attributes
					for (var i = 0; i < rows.length; ++i) {
						var interest = {
							id: rows[i].Id,
							en_name: rows[i].EN_Name,
							ar_name: rows[i].AR_Name
						};
						if (lang) {
							interest.name = interest[lang.toLowerCase() + '_name'];
							interest.description = interest[lang.toLowerCase() + '_description'];
						}
						interests.push(interest);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(interests);
				}
			});
		}
	});
};

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;