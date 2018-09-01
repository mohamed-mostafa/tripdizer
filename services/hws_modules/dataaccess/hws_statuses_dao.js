/**
 * The dataaccess methods of hws
 */

var daoUtilities = require("./hws_dao_utilities.js");

var getById = function (id, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM statuses WHERE id = ?', [id], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to find a status type with id " + id);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						// populate the status attributes
						var status = {
							id: rows[0].Id,
							title: rows[0].Title,
							refresh: rows[0].Refresh,
							color: rows[0].Color,
							watermark: rows[0].Watermark,
							size: {
								xs: rows[0].Size_XS,
								sm: rows[0].Size_SM,
								md: rows[0].Size_MD,
								lg: rows[0].Size_LG,
							},
							order: rows[0].Order
						};

						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(status);
					} else {
						// no status is found with the id
						connection.end();
						onSuccess(null);
					}
				}

			});
		}
	});
};


var create = function (status, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the status and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('INSERT INTO `statuses` (`Title`, `Refresh`, `Color`, `Watermark`, `Size_XS`, `Size_SM`, `Size_MD`, `Size_LG`, `Order`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [status.title, status.refresh, status.color, status.watermark, status.size.xs, status.size.sm, status.size.md, status.size.lg, status.order], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to create the new status: " + status.title);
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// set the insertId to the status
							status.id = result.insertId;

							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(status);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a et status object if successful
//calls the onFailure with an err object in case of technical error
var update = function (status, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the status and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('UPDATE `statuses` SET `Title` = ?, `Refresh` = ?, `Color` = ?, `Watermark` = ?, `Size_XS` = ?, `Size_SM` = ?, `Size_MD` = ?, `Size_LG` = ?, `Order` = ? WHERE `Id` = ?', [status.title, status.refresh, status.color, status.watermark, status.size.xs, status.size.sm, status.size.md, status.size.lg, status.order, status.id], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							console.log("An error occurred while trying to update the existing status: " + status.id);
							console.log(err);
							connection.rollback(); // rollback the transaction
							// end the connection
							connection.end();
							onFailure(err);
						} else {
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(status);
						}
					});
				}
			});
		}
	});
};

var deleteFunc = function (id, migrateToId, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('UPDATE `traveler_request` SET `Status` = ? WHERE `Status` = ?;DELETE FROM statuses WHERE id = ?', [migrateToId, id, id], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to find a status type with id " + id);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows[1].affectedRows > 0) {
						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess({
							success: true,
							id: id
						});
					} else {
						// no status is found with the id
						connection.end();
						onSuccess({
							success: false,
							id: id
						});
					}
				}

			});
		}
	});
};

//calls the onSuccess with a list of delivery persons or an empty list
//calls the onFailure with an err object in case of technical error
var getAll = function (onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM `statuses` ORDER BY `Order` ASC', [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all statuses");
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					var statuses = [];
					// populate the attributes
					for (var i = 0; i < rows.length; ++i) {
						var status = {
							id: rows[i].Id,
							title: rows[i].Title,
							refresh: rows[i].Refresh,
							color: rows[i].Color,
							watermark: rows[i].Watermark,
							size: {
								xs: rows[i].Size_XS,
								sm: rows[i].Size_SM,
								md: rows[i].Size_MD,
								lg: rows[i].Size_LG,
							},
							order: rows[i].Order
						};
						statuses.push(status);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(statuses);
				}
			});
		}
	});
};

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.delete = deleteFunc;
exports.getAll = getAll;