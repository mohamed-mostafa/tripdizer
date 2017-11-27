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
			connection.query('SELECT * FROM Budget_Category WHERE id = ?', [id], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to find a budget category with id " + id);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						// populate the budget category attributes
						var budgetCategory = {
							id: rows[0].Id,
							en_name: rows[0].EN_Name,
							en_description: rows[0].EN_description,
							ar_name: rows[0].AR_Name,
							ar_description: rows[0].AR_description
						};

						if (lang) {
							budgetCategory.name = budgetCategory[lang.toLowerCase() + '_name'];
							budgetCategory.description = budgetCategory[lang.toLowerCase() + '_description'];
						}

						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(budgetCategory);
					} else {
						// no budget categories is found with the id
						connection.end();
						onSuccess(null);
					}
				}

			});
		}
	});
};


var create = function (budgetCategory, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the budget category and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('INSERT INTO Budget_Category (EN_Name, EN_Description, AR_Name, AR_Description) values (?, ?, ?, ?)', [budgetCategory.en_name, budgetCategory.en_description, budgetCategory.ar_name, budgetCategory.ar_description], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to create the new budget category: " + budgetCategory.en_name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// set the insertId to the budget category
							budgetCategory.id = result.insertId;

							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(budgetCategory);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a budget category object if successful
//calls the onFailure with an err object in case of technical error
var update = function (budgetCategory, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the budget category and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('UPDATE Budget_Category SET EN_Name = ?, EN_Description = ?, AR_Name = ?, AR_Description = ?', [budgetCategory.en_name, budgetCategory.en_description, budgetCategory.ar_name, budgetCategory.ar_description, budgetCategory.id], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							console.log("An error occurred while trying to update the existing budgetCategory: " + budgetCategory.en_name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							// end the connection
							connection.end();
							onFailure(err);
						} else {
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(budgetCategory);
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
			connection.query('SELECT * FROM Budget_Category order by id desc', [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all budget categories");
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					var budgetCategories = [];
					// populate the attributes
					for (var i = 0; i < rows.length; ++i) {
						var budgetCategory = {
							id: rows[i].Id,
							en_name: rows[i].EN_Name,
							en_description: rows[i].EN_description,
							ar_name: rows[i].AR_Name,
							ar_description: rows[i].AR_description
						};
						if (lang) {
							budgetCategory.name = budgetCategory[lang.toLowerCase() + '_name'];
							budgetCategory.description = budgetCategory[lang.toLowerCase() + '_description'];
						}
						budgetCategories.push(budgetCategory);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(budgetCategories);
				}
			});
		}
	});
};

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;