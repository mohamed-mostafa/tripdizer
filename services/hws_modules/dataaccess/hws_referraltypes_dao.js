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
			connection.query('SELECT * FROM Referral_Types WHERE id = ?', [id], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to find a referral type with id " + id);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						// populate the referral type attributes
						var referralType = {
							id: rows[0].Id,
							enName: rows[0].EN_Name,
							arName: rows[0].AR_Name,
						};

						if (lang) {
							referralType.name = referralType[lang.toLowerCase() + 'Name'];
							delete referralType['enName'];
							delete referralType['arName'];
						}

						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(referralType);
					} else {
						// no referral types is found with the id
						connection.end();
						onSuccess(null);
					}
				}

			});
		}
	});
};


var create = function (referralType, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the referral type and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('INSERT INTO Referral_Types (EN_Name, AR_Name) values (?, ?)', [referralType.enName, referralType.arName], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to create the new referral type: " + referralType.enName);
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// set the insertId to the referral type
							referralType.id = result.insertId;

							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(referralType);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a et referral type object if successful
//calls the onFailure with an err object in case of technical error
var update = function (referralType, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the referral type and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('UPDATE Referral_Types SET EN_Name = ?, AR_Name = ? WHERE Id = ?', [referralType.enName, referralType.arName, referralType.id], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							console.log("An error occurred while trying to update the existing referral type: " + referralType.enName);
							console.log(err);
							connection.rollback(); // rollback the transaction
							// end the connection
							connection.end();
							onFailure(err);
						} else {
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(referralType);
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
			connection.query('SELECT * FROM Referral_Types ORDER BY Id DESC', [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all referral types");
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					var referralTypes = [];
					// populate the attributes
					for (var i = 0; i < rows.length; ++i) {
						var referralType = {
							id: rows[i].Id,
							enName: rows[i].EN_Name,
							arName: rows[i].AR_Name
						};
						if (lang) {
							referralType.name = referralType[lang.toLowerCase() + 'Name'];
							delete referralType['enName'];
							delete referralType['arName'];
						}
						referralTypes.push(referralType);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(referralTypes);
				}
			});
		}
	});
};

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;