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
			connection.query('SELECT gt.*, i.EN_Name, i.EN_Description, i.AR_Name, i.AR_Description, i.Needs_Visa FROM group_trips gt JOIN iternary i ON gt.Iternary_Id = i.Id WHERE gt.Id = ?', [id], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to find a group trip with id " + id);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						// populate the group trip attributes
						var groupTrip = {
							id: rows[0].Id,
							iternaryId: rows[0].Iternary_Id,
							enName: rows[0].EN_Name,
							arName: rows[0].AR_Name,
							enDescription: rows[0].EN_Description,
							arDescription: rows[0].AR_Description,
							departureDate: rows[0].Departure_Date,
							returnDate: rows[0].Return_Date,
							numOfPersons: rows[0].Num_Of_Persons,
							totalCost: rows[0].Total_Cost,
							needsVisa: rows[0].Needs_Visa,
							image: rows[0].Image,
							isNew: rows[0].isNew,
							isEnded: rows[0].isEnded
						};
						if (lang) {
							groupTrip.name = groupTrip[lang.toLowerCase() + 'Name'];
							groupTrip.description = groupTrip[lang.toLowerCase() + 'Description'];
							delete groupTrip['enName'];
							delete groupTrip['arName'];
							delete groupTrip['enDescription'];
							delete groupTrip['arDescription'];
						}

						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(groupTrip);
					} else {
						// no group trip is found with the id
						connection.end();
						onSuccess(null);
					}
				}

			});
		}
	});
};

var create = function (trip, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the group trip and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('INSERT INTO group_trips (`Iternary_Id`, `Departure_Date`, `Return_Date`, `Num_Of_Persons`, `Total_Cost`, `Image`) VALUES (?, ?, ?, ?, ?, ?)', [trip.iternaryId, trip.departureDate, trip.returnDate, trip.numOfPersons, trip.totalCost, trip.image], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to create the new group trip: " + trip.iternaryId);
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							getById(result.insertId, null, onSuccess, onFailure);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a itinerary object if successful
//calls the onFailure with an err object in case of technical error
var toggle = function (groupTripId, type, onSuccess, onFailure) {
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
					connection.query(`UPDATE group_trips SET \`${type}\` = !\`${type}\` WHERE Id = ?`, [groupTripId], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							console.log("An error occurred while trying to update the existing group trip id: " + groupTripId);
							console.log(err);
							connection.rollback(); // rollback the transaction
							// end the connection
							connection.end();
							onFailure(err);
						} else {
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess({
								success: result.affectedRows === 1,
								message: result.message
							});
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
			connection.query('SELECT gt.*, i.EN_Name, i.EN_Description, i.AR_Name, i.AR_Description, i.Needs_Visa FROM group_trips gt JOIN iternary i ON gt.Iternary_Id = i.Id', [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all group trips");
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					var groupTrips = [];
					// populate the attributes
					for (var i = 0; i < rows.length; ++i) {
						var groupTrip = {
							id: rows[i].Id,
							iternaryId: rows[i].Iternary_Id,
							enName: rows[i].EN_Name,
							enDescription: rows[i].EN_Description,
							arName: rows[i].AR_Name,
							arDescription: rows[i].AR_Description,
							departureDate: rows[i].Departure_Date,
							returnDate: rows[i].Return_Date,
							numOfPersons: rows[i].Num_Of_Persons,
							totalCost: rows[i].Total_Cost,
							needsVisa: rows[i].Needs_Visa,
							image: rows[i].Image,
							isNew: rows[i].isNew,
							isEnded: rows[i].isEnded
						};
						if (lang) {
							groupTrip.name = groupTrip[lang.toLowerCase() + 'Name'];
							groupTrip.description = groupTrip[lang.toLowerCase() + 'Description'];
							delete groupTrip['enName'];
							delete groupTrip['arName'];
							delete groupTrip['enDescription'];
							delete groupTrip['arDescription'];
						}
						groupTrips.push(groupTrip);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(groupTrips);
				}
			});
		}
	});
};

exports.getById = getById;
exports.create = create;
exports.toggle = toggle;
exports.getAll = getAll;