/**
 * The dataaccess methods of hws
 */

var daoUtilities = require("./hws_dao_utilities.js");

var getPartnerById = function(id, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM hws.partner WHERE id = ?', [id], function(err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to find a partner with id " + id);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						// populate the partner attributes
						var partner = {
						id: rows[0].id,
						name: rows[0].name,
						email: rows[0].email,
						active: rows[0].active,
						};
						
						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(partner);
					} else {
						// no partner is found with the id
						connection.end();
						onSuccess(null);
					}
				}
				
			});
		}
	});
};


var createNewPartner = function(partner, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the partner and his addresses
			connection.beginTransaction(function(err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('INSERT INTO hws.partner (name, email) values (?, ?)', [partner.name, partner.email], function(err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to create the new partner: " + partner.name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// set the partnerId to the partner
							partner.id = result.insertId;
							
							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(partner);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a partner object if successful
//calls the onFailure with an err object in case of technical error
var updateExistingPartner = function(partner, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the partner and his addresses
			connection.beginTransaction(function(err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('UPDATE hws.partner SET name = ?, email= ?, active= ? WHERE id=?', [partner.name, partner.email, partner.active, partner.id], function(err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							console.log("An error occurred while trying to update the existing partner: " + partner.name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							// end the connection
							connection.end();
							onFailure(err);
						} else {
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(partner);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a list of delivery persons or an empty list
//calls the onFailure with an err object in case of technical error
var getAllPartners = function(onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM hws.partner', [], function(err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all partners");
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					var partners = [];
					// populate the attributes
					for (var i = 0; i < rows.length; i++) {
						var partner = {
								id: rows[i].id,
								name: rows[i].name,
								email: rows[i].email,
								active: rows[i].active,
						};
						partners.push(partner);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(partners);
				}
			});
		}
	});
};


exports.getPartnerById = getPartnerById;
exports.createNewPartner = createNewPartner;
exports.updateExistingPartner = updateExistingPartner;
exports.getAllPartners = getAllPartners;
