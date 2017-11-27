/**
 * The dataaccess methods of hws
 */

var daoUtilities = require("./hws_dao_utilities.js");


//calls the onSuccess with a user object or null
//calls the onFailure with an err object in case of technical error
var getUserByUsername = function(username, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM user WHERE username = ?', [username], function(err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to find a user with username " + username);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						// populate the user attributes
						var user = {
						id: rows[0].id,
						username: rows[0].username,
						password: rows[0].password,
						fullName: rows[0].full_name,
						phone: rows[0].phone,
						admin: rows[0].admin
						};
						
						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(user);
						// get the addresses of the user
					} else {
						// no user is found with the username
						connection.end();
						onSuccess(null);
					}
				}
				
			});
		}
	});
};

var getUserById = function(id, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM user WHERE id = ?', [id], function(err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to find a user with id " + id);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						// populate the user attributes
						var user = {
						id: rows[0].id,
						username: rows[0].username,
						password: rows[0].password,
						fullName: rows[0].full_name,
						phone: rows[0].phone,
						admin: rows[0].admin
						};
						
						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(user);
					} else {
						// no user is found with the id
						connection.end();
						onSuccess(null);
					}
				}
				
			});
		}
	});
};


var createNewUser = function(user, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the user and his addresses
			connection.beginTransaction(function(err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('INSERT INTO user (username, password, full_name, phone, active) values (?, ?, ?, ?, ?)', [user.username, user.password, user.fullName, user.phone, 1], function(err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to create the new user: " + user.username);
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// set the userId to the user
							user.id = result.insertId;
							
							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(user);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a user object if successful
//calls the onFailure with an err object in case of technical error
var updateExistingUser = function(user, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the user and his addresses
			connection.beginTransaction(function(err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('UPDATE user SET password = ?, full_name= ?, phone= ?, active= ? WHERE id=?', [user.password, user.fullName, user.phone, user.active, user.id], function(err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							console.log("An error occurred while trying to update the existing user: " + user.username);
							console.log(err);
							connection.rollback(); // rollback the transaction
							// end the connection
							connection.end();
							onFailure(err);
						} else {
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(user);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a list of delivery persons or an empty list
//calls the onFailure with an err object in case of technical error
var getAllUsers = function(onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function(err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT * FROM user', [], function(err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all users");
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					var users = [];
					// populate the attributes
					for (var i = 0; i < rows.length; i++) {
						var user = {
								id: rows[i].id,
								username: rows[i].username,
								password: rows[i].password,
								fullName: rows[i].full_name,
								phone: rows[i].phone,
								active: rows[i].active,
								admin: rows[i].admin
						};
						users.push(user);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(users);
				}
			});
		}
	});
};


exports.getUserByUsername = getUserByUsername;
exports.getUserById = getUserById;
exports.createNewUser = createNewUser;
exports.updateExistingUser = updateExistingUser;
exports.getAllUsers = getAllUsers;
