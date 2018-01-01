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
			connection.query('SELECT * FROM iternary WHERE id = ?', [id], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to find a itinerary with id " + id);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						// populate the itinerary attributes
						var itinerary = {
							id: rows[0].Id,
							en_name: rows[0].EN_Name,
							en_description: rows[0].EN_Description,
							ar_name: rows[0].AR_Name,
							ar_description: rows[0].AR_Description,
							dailySpendings: rows[0].Daily_Spendings,
							stars: rows[0].Stars,
						};

						if (lang) {
							itineraryitinerary.name = itineraryitinerary[lang.toLowerCase() + '_name'];
							itineraryitinerary.description = itineraryitinerary[lang.toLowerCase() + '_description'];
						}

						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(itinerary);
					} else {
						// no itinerary is found with the id
						connection.end();
						onSuccess(null);
					}
				}

			});
		}
	});
};


var create = function (itinerary, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the itinerary and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('INSERT INTO iternary (EN_Name, EN_Description, AR_Name, AR_Description, Daily_Spendings, Stars) values (?, ?, ?, ?, ?, ?)', [itinerary.en_name, itinerary.en_description, itinerary.ar_name, itinerary.ar_description, itinerary.dailySpendings, itinerary.stars], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to create the new itinerary: " + itinerary.en_name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// set the itineraryId to the itinerary
							itinerary.id = result.insertId;

							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(itinerary);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a itinerary object if successful
//calls the onFailure with an err object in case of technical error
var update = function (itinerary, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the itinerary and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('UPDATE iternary SET EN_Name = ?, EN_Description = ?, AR_Name = ?, AR_Description = ?, Daily_Spendings = ?, Stars = ? WHERE Id = ?', [itinerary.en_name, itinerary.en_description, itinerary.ar_name, itinerary.ar_description, itinerary.dailySpendings, itinerary.stars, itinerary.id], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							console.log("An error occurred while trying to update the existing itinerary: " + itinerary.en_name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							// end the connection
							connection.end();
							onFailure(err);
						} else {
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(itinerary);
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
			connection.query('SELECT * FROM iternary', [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all itineraries");
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					var itineraries = [];
					// populate the attributes
					for (var i = 0; i < rows.length; ++i) {
						console.log(rows[i])
						var itinerary = {
							id: rows[i].Id,
							en_name: rows[i].EN_Name,
							en_description: rows[i].EN_Description,
							ar_name: rows[i].AR_Name,
							ar_description: rows[i].AR_Description,
							dailySpendings: rows[i].Daily_Spendings,
							stars: rows[i].Stars,
						};
						if (lang) {
							itinerary.name = itinerary[lang.toLowerCase() + '_name'];
							itinerary.description = itinerary[lang.toLowerCase() + '_description'];
						}
						itineraries.push(itinerary);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(itineraries);
				}
			});
		}
	});
};

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;