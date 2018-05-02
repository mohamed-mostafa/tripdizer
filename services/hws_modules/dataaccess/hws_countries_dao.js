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
			connection.query('SELECT * FROM Countries WHERE id = ?', [id], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to find a country with id " + id);
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					if (rows.length != 0) {
						// populate the country attributes
						var country = {
							id: rows[0].Id,
							en_name: rows[0].EN_Name,
							en_description: rows[0].EN_Description,
							ar_name: rows[0].AR_Name,
							ar_description: rows[0].AR_Description,
							thumbnail: rows[0].Thumbnail,
							lat: rows[0].Latitude,
							lng: rows[0].Longitude,
							budget: rows[0].Budget_Category,
							purpose: rows[0].Travel_Purpose,
						};

						if (lang) {
							country.name = country[lang.toLowerCase() + '_name'];
							country.description = country[lang.toLowerCase() + '_description'];
						}

						// end the connection
						connection.end();
						// call the callback function provided by the caller, and give it the response
						onSuccess(country);
					} else {
						// no country is found with the id
						connection.end();
						onSuccess(null);
					}
				}

			});
		}
	});
};


var create = function (country, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the country and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('INSERT INTO Countries (EN_Name, EN_Description, AR_Name, AR_Description, Thumbnail, Latitude, Longitude, Budget_Category, Travel_Purpose) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [country.en_name, country.en_description, country.ar_name, country.ar_description, country.thumbnail, country.lat, country.lng, country.budget, country.purpose], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							// end the connection
							connection.end();
							console.log("An error occurred while trying to create the new country: " + country.en_name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							onFailure(err);
						} else {
							// set the countryId to the country
							country.id = result.insertId;

							// end the connection
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(country);
						}
					});
				}
			});
		}
	});
};

//calls the onSuccess with a country object if successful
//calls the onFailure with an err object in case of technical error
var update = function (country, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// begin a transaction to insert the country and his addresses
			connection.beginTransaction(function (err) {
				// execute the query
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while trying to begin a database transaction");
					console.log(err);
					onFailure(err);
				} else {
					connection.query('UPDATE Countries SET EN_Name = ?, EN_Description = ?, AR_Name = ?, AR_Description = ?, Thumbnail = ?, Latitude = ?, Longitude = ?, Budget_Category = ?, Travel_Purpose = ? WHERE Id = ?', [country.en_name, country.en_description, country.ar_name, country.ar_description, country.thumbnail, country.lat, country.lng, country.budget, country.purpose, country.id], function (err, result) {
						// if an error is thrown, end the connection and throw an error
						if (err) { // if the first insert statement fails
							console.log("An error occurred while trying to update the existing country: " + country.en_name);
							console.log(err);
							connection.rollback(); // rollback the transaction
							// end the connection
							connection.end();
							onFailure(err);
						} else {
							connection.commit();
							connection.end();
							// call the callback function provided by the caller, and give it the response
							onSuccess(country);
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
			connection.query('SELECT * FROM Countries', [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all countries");
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					var countries = [];
					// populate the attributes
					for (var i = 0; i < rows.length; ++i) {
						var country = {
							id: rows[i].Id,
							en_name: rows[i].EN_Name,
							en_description: rows[i].EN_Description,
							ar_name: rows[i].AR_Name,
							ar_description: rows[i].AR_Description,
							thumbnail: rows[i].Thumbnail,
							lat: rows[i].Latitude,
							lng: rows[i].Longitude,
							budget: rows[i].Budget_Category,
							purpose: rows[i].Travel_Purpose,
						};
						if (lang) {
							country.name = country[lang.toLowerCase() + '_name'];
							country.description = country[lang.toLowerCase() + '_description'];
						}
						countries.push(country);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(countries);
				}
			});
		}
	});
};

var getAllCountriesInIternaries = function (lang, onSuccess, onFailure) {
	// get a connection and open it
	var connection = daoUtilities.createConnection();
	connection.connect(function (err) {
		if (err) {
			console.log("An error occurred while trying to open a database connection");
			console.log(err);
			onFailure(err);
		} else {
			// execute the query
			connection.query('SELECT c.* FROM hws.Countries c where Id in (select Countries_Id from hws.iternary_countries)', [], function (err, rows) {
				// if an error is thrown, end the connection and throw an error
				if (err) {
					// end the connection
					connection.end();
					console.log("An error occurred while list all countries in iternaries");
					console.log(err);
					onFailure(err);
				} else {
					// no error is thrown
					var countries = [];
					// populate the attributes
					for (var i = 0; i < rows.length; ++i) {
						var country = {
							id: rows[i].Id,
							en_name: rows[i].EN_Name,
							en_description: rows[i].EN_Description,
							ar_name: rows[i].AR_Name,
							ar_description: rows[i].AR_Description,
							thumbnail: rows[i].Thumbnail,
							lat: rows[i].Latitude,
							lng: rows[i].Longitude,
							budget: rows[i].Budget_Category,
							purpose: rows[i].Travel_Purpose,
						};
						if (lang) {
							country.name = country[lang.toLowerCase() + '_name'];
							country.description = country[lang.toLowerCase() + '_description'];
						}
						countries.push(country);
					}
					// end the connection
					connection.end();
					// call the callback function provided by the caller, and give it the response
					onSuccess(countries);
				}
			});
		}
	});
};

exports.getById = getById;
exports.create = create;
exports.update = update;
exports.getAll = getAll;
exports.getAllCountriesInIternaries = getAllCountriesInIternaries;